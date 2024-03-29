import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '~/components/Button'
import {
    AtIcon,
    InfoIcon,
    SolidDownArrowIcon,
    TagIcon,
} from '~/components/Icons'
import Spinner from '~/components/Spinner/Spinner'
import { appSelector, usersSelector } from '~/redux/selectors'
import videosSlice from '~/redux/slices/videosSlice'
import * as videoService from '~/services/videoService'
import DiscardModal from './DiscardModal'
import RedirectModal from './RedirectModal'
import { Wrapper } from './styled'
import * as notificationService from '~/services/notificationService'
import {
    uploadDataUrlFirebase,
    uploadFileFirebase,
} from '~/services/firebaseService'
import SearchUser from './SearchUser'

export default function RightBody({
    thumbnails,
    caption,
    setCaption,
    videoThumb,
    setVideoThumb,
    duration,
    onDiscard,
    video,
    currentUser,
}) {
    const [offset, setOffset] = useState(4)
    const [scroll, setScroll] = useState(0)
    const [translateX, setTranslateX] = useState(8)
    const [discardModalShow, setDiscardModalShow] = useState(false)
    const [isUploaded, setIsUploaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectFormShow, setSelectFormShow] = useState(false)
    const [copyrightActive, setCopyrightActive] = useState(false)
    const [formData, setFormData] = useState({
        src: '',
        privacy: 'public',
        cover: '',
        allowance: {
            comment: true,
            duet: true,
            stitch: true,
        },
        music: '',
    })

    const { users } = useSelector(usersSelector)
    const { socket } = useSelector(appSelector)
    const captionRef = useRef(null)
    const privacyRef = useRef(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (caption.match(/@\B/g)) {
            setSelectFormShow(true)
        } else {
            captionRef.current.focus()
            setSelectFormShow(false)
        }
    }, [caption])

    useEffect(() => {
        const x = offset - scroll
        if (x < 4) {
            return setTranslateX(4)
        }
        if (x > 580) {
            return setTranslateX(580)
        }
        setTranslateX(x)
    }, [offset, scroll])

    useEffect(() => {
        setFormData({
            ...formData,
            title: caption,
            music: `Original sound - @${currentUser?.username}`,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [caption, currentUser])

    useEffect(() => {
        setOffset(0)
        setScroll(0)
    }, [thumbnails])

    const handleInputChange = (e) => {
        const target = e.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        if (target.type === 'checkbox') {
            setFormData({
                ...formData,
                allowance: {
                    ...formData.allowance,
                    [name]: value,
                },
            })
        } else {
            setFormData({
                ...formData,
                [name]: value,
            })
        }
    }

    const handleClickTagIcon = () => {
        setFormData({
            ...formData,
            title: (prev) => prev.concat('#'),
        })
        setCaption((prev) => prev.concat('#'))
        captionRef.current.focus()
    }

    const handleRedirect = () => {
        navigate(`/@${currentUser.username}`)
    }

    const handleDiscard = () => {
        onDiscard()
        setFormData({
            src: '',
            privacy: 'public',
            cover: '',
            allowance: {
                comment: true,
                duet: true,
                stitch: true,
            },
            music: '',
        })
        const checkedInputs = document.querySelectorAll('.checkbox-input')
        checkedInputs.forEach((checkedInput) => {
            checkedInput.checked = true
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (video) {
            setIsLoading(true)

            // Upload to firebase
            const videoUrl = await uploadFileFirebase('videos/', video)
            const imgUrl = await uploadDataUrlFirebase('images/', videoThumb)

            // Upload Video
            const newFormData = {
                ...formData,
                src: videoUrl,
                cover: imgUrl,
            }
            
            const response = await videoService.create(newFormData)
            const user = users.find((user) => user._id === response.user)
            const newVideo = {
                ...response,
                user,
            }
            dispatch(videosSlice.actions.addVideo(newVideo))
            setIsLoading(false)
            setIsUploaded(true)
            onDiscard()

            // Send notification to tag user
            const tagUsernames = newVideo.title.match(/[@]\w*\b/g) || []
            if (tagUsernames.length > 0) {
                const tagUsers = users.filter((user) =>
                    tagUsernames.some(
                        (username) =>
                            username.replace('@', '') === user.username
                    )
                )
                tagUsers.forEach(async (user) => {
                    const data = {
                        receiver: user._id,
                        type: 'mention',
                        video: newVideo,
                        sender: currentUser,
                    }

                    socket.emit('sendNotification', data)

                    if (data.receiver !== data.sender._id) {
                        await notificationService.create({
                            ...data,
                            createdAt: new Date(),
                        })
                    }
                })
            }
        }
    }

    const privacys = ['public', 'friends', 'private']

    if (isLoading) return <Spinner />

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    {selectFormShow ? (
                        <>
                            <div className="title">
                                <label htmlFor="search-user" className="label">
                                    <AtIcon width="1.4rem" height="1.4rem" />
                                    Friends
                                </label>
                            </div>

                            <SearchUser
                                input={caption}
                                setInput={setCaption}
                                setSelectFormShow={setSelectFormShow}
                            />
                        </>
                    ) : (
                        <>
                            <div className="title">
                                <label htmlFor="caption">Caption</label>
                                <div className="limited">0 / 150</div>
                            </div>

                            <div className="input-container">
                                <input
                                    type="text"
                                    maxLength={150}
                                    className="input"
                                    id="caption"
                                    value={caption}
                                    name="title"
                                    onChange={(e) => setCaption(e.target.value)}
                                    ref={captionRef}
                                />

                                <span className="hashtag">
                                    <span
                                        className="hash icon-wrapper"
                                        onClick={() =>
                                            setSelectFormShow('true')
                                        }
                                    >
                                        <AtIcon
                                            width="1.5rem"
                                            height="1.5rem"
                                        />
                                    </span>
                                    <span
                                        className="tag icon-wrapper"
                                        onClick={handleClickTagIcon}
                                    >
                                        <TagIcon
                                            width="1.5rem"
                                            height="1.5rem"
                                        />
                                    </span>
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="form-group">
                    <div className="title">
                        <span>Cover</span>
                    </div>
                    <div className="bg-container">
                        {thumbnails.length > 0 ? (
                            <>
                                <div
                                    className="thumbnails"
                                    style={{
                                        maxWidth: '680px',
                                        overflow: 'auto',
                                    }}
                                    onScroll={(e) =>
                                        setScroll(e.target.scrollLeft)
                                    }
                                >
                                    {thumbnails.map((item, index) => (
                                        <img
                                            onClick={(e) => {
                                                setVideoThumb(item)
                                                setOffset(e.target.offsetLeft)
                                            }}
                                            src={item}
                                            alt="cover"
                                            key={index}
                                            className="thumbnail"
                                            style={{
                                                width: `calc(680px / ${duration}`,
                                            }}
                                        />
                                    ))}
                                </div>

                                {videoThumb && (
                                    <div
                                        className="choosen"
                                        style={{
                                            transform: `translate3d( ${translateX}px ,1px, 0px) scaleX(1.1) scaleY(1.1)`,
                                        }}
                                    >
                                        <img
                                            src={videoThumb}
                                            alt="thumbnail"
                                            className="choosen-thumbnail"
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-empty"></div>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <div
                        className="privacy-select-container"
                        ref={privacyRef}
                        onClick={() =>
                            privacyRef.current.classList.toggle('show')
                        }
                    >
                        <div className="select-label">
                            <span className="text">{formData.privacy}</span>
                            <span className="icon icon-wrapper">
                                <SolidDownArrowIcon
                                    width="1.6rem"
                                    height="1.6rem"
                                />
                            </span>
                        </div>
                        <div className="select-list">
                            {privacys.map((privacy, index) => (
                                <div
                                    className="select-option"
                                    key={index}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            privacy,
                                        })
                                    }
                                >
                                    {privacy}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="title">Allow users to</div>
                    <div className="checkbox-container">
                        <label className="checkbox">
                            Comment
                            <input
                                type="checkbox"
                                className="checkbox-input"
                                name="comment"
                                defaultChecked={formData.allowance.comment}
                                onChange={handleInputChange}
                            />
                            <span className="checkmark"></span>
                        </label>
                        <label className="checkbox">
                            Duet
                            <input
                                name="duet"
                                type="checkbox"
                                className="checkbox-input"
                                defaultChecked={formData.allowance.duet}
                                onChange={handleInputChange}
                            />
                            <span className="checkmark"></span>
                        </label>
                        <label className="checkbox">
                            Stitch
                            <input
                                name="stitch"
                                type="checkbox"
                                className="checkbox-input"
                                defaultChecked={formData.allowance.stitch}
                                onChange={handleInputChange}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <div className="title title-copyright">
                        <span className="copyright">Run a copyright check</span>
                        <div
                            className={
                                copyrightActive ? 'switch active' : 'switch'
                            }
                            onClick={() => setCopyrightActive(!copyrightActive)}
                        >
                            <div className="switch-wrapper">
                                <span className="switch-inner"></span>
                            </div>
                        </div>
                    </div>

                    {copyrightActive ? (
                        <div className="copyright-check-desc">
                            <span className="info icon-wrapper">
                                <InfoIcon width="1.6rem" height="1.6rem" />
                            </span>
                            Kiểm tra bản quyền chỉ bắt đầu sau khi bạn tải video
                            của mình lên.
                        </div>
                    ) : (
                        <p className="copyright-desc">
                            We'll check your video for potential copyright
                            infringements on used sounds. If infringements are
                            found, you can edit the video before posting.{' '}
                            <b>Learn more</b>
                        </p>
                    )}
                </div>

                <div className="button-group">
                    <Button
                        secondary
                        type="button"
                        className="action-btn"
                        onClick={() => setDiscardModalShow(!discardModalShow)}
                    >
                        Discard
                    </Button>
                    <Button
                        disabled={!videoThumb}
                        type="submit"
                        className="action-btn"
                        primary
                    >
                        Post
                    </Button>
                </div>
            </form>

            {discardModalShow && (
                <DiscardModal
                    onCancel={() => setDiscardModalShow(!discardModalShow)}
                    onDiscard={handleDiscard}
                />
            )}
            {isUploaded && (
                <RedirectModal
                    onCancel={() => {
                        setIsUploaded(false)
                    }}
                    onRedirect={handleRedirect}
                />
            )}
        </Wrapper>
    )
}
