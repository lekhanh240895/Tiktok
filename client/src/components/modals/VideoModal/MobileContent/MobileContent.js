import { Wrapper } from './styled';
import { useEffect, useRef, useState } from 'react';
import Comment from '~/components/Comment';
import * as commentService from '~/services/commentService';
import { useSelector } from 'react-redux';
import { appSelector, authSelector } from '~/redux/selectors';
import AddCommentForm from './AddCommentForm';
import { TimesIcon } from '~/components/Icons';

export default function MobileContent({
    video,
    showCommentContent,
    onHideCommentContent,
}) {
    const commentRef = useRef(null);
    const { currentUser } = useSelector(authSelector);
    const [comments, setComments] = useState([]);
    const [isAddComment, setIsAddComment] = useState(false);
    const { socket } = useSelector(appSelector);

    useEffect(() => {
        const fetchComments = async () => {
            const comments = await commentService.get(video._id);
            setComments(comments);
        };
        if (video) {
            fetchComments();
        }
    }, [video]);

    useEffect(() => {
        if (isAddComment) {
            commentRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
            setIsAddComment(false);
        }
    }, [isAddComment]);

    const handleDeleteComment = async (commentID) => {
        const deleteComment = await commentService.remove(commentID);
        const newComments = comments.filter(
            (comment) => comment._id !== deleteComment._id,
        );
        setComments(newComments);
    };

    return (
        <Wrapper className={showCommentContent ? 'show' : 'hide'}>
            <div className="header">
                <span className="comments-count">
                    {comments.length} bình luận
                </span>
                <span
                    className="close-icon icon-wrapper"
                    onClick={onHideCommentContent}
                >
                    <TimesIcon width="2.4rem" height="2.4rem" />
                </span>
            </div>
            <div className="comments-container">
                <ul className="comment-list" ref={commentRef}>
                    {comments.map((comment) => (
                        <li className="comment-item" key={comment._id}>
                            <Comment
                                comment={comment}
                                onDeleteComment={handleDeleteComment}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            <AddCommentForm
                video={video}
                currentUser={currentUser}
                setIsAddComment={setIsAddComment}
                comments={comments}
                setComments={setComments}
                socket={socket}
            />
        </Wrapper>
    );
}
