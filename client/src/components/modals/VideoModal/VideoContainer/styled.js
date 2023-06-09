import styled from 'styled-components';

export const Wrapper = styled.div`
    &.video-container {
        flex: 1;
        background-color: rgb(27 24 23);
        position: relative;
        overflow: hidden;

        .body {
            padding: 0 80px;
            position: relative;
            width: 100%;
            height: 100%;

            .video-layout {
                position: relative;
                width: 100%;
                height: 100%;
                cursor: pointer;
                background-color: rgba(22, 24, 35, 0.06);
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center center;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .video-wrapper {
                position: absolute;
                left: 0px;
                top: 0px;
                width: 100%;
                height: 100%;

                .video {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                &:hover > .video-controller-container {
                    opacity: 1;
                }

                .play-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #fff;
                }
            }

            .blur-background {
                position: absolute;
                width: 10%;
                height: 10%;
                filter: blur(2px);
                left: 50%;
                top: 50%;
                transform: scale(11);
                opacity: 0.3;
                background: center center / cover no-repeat;
            }

            .volume-wrapper {
                width: 28px;
                height: 96px;
                cursor: initial;
                background: rgb(255 255 255 / 12%);
                border-radius: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                .bar {
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    transform: translateX(50%);
                    width: 4px;
                    background-color: #fff;
                    border-radius: 4px;
                    margin-left: -4px;
                    margin-bottom: 8px;
                }

                .volume-input {
                    width: 80px;
                    height: 4px;
                    transform: rotate(-90deg);
                    position: absolute;
                    z-index: 1;
                }

                .volume-input::-webkit-slider-runnable-track {
                    cursor: pointer;
                    background: rgb(255 255 255 / 20%);
                    border-radius: 4px;
                    width: 100%;
                    height: 100%;
                }

                .volume-input::-webkit-slider-thumb {
                    --webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: var(--white-color);
                    cursor: pointer;
                    margin-top: -6px;
                    margin-right: 50px;
                }
            }

            .volume-icon-wrapper {
                position: absolute;
                right: 20px;
                bottom: 20px;
                color: #fff;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgb(255 255 255 / 12%);
                z-index: 1;
            }

            .video-controller-container {
                display: flex;
                height: 24px;
                max-width: 56.25vh;
                align-items: center;
                justify-content: space-between;
                position: absolute;
                bottom: 28px;
                left: 50%;
                transform: translateX(-50%);
                width: calc(100% - 32px);
                padding: 0 16px;
                opacity: 0;
                transition: opacity 0.3s ease-out;
                z-index: 1;
            }

            .progress-wrapper {
                position: relative;
                flex: 1 1 auto;
                height: 24px;
                width: 100%;

                &:hover .progress {
                    height: 6px;
                }
                &:hover .progress-circle {
                    display: block;
                }

                &:hover .progress-bar {
                    height: 6px;
                }

                .progress {
                    width: 100%;
                    height: 4px;
                    background-color: rgb(255 255 255 / 20%);
                    position: absolute;
                    z-index: 99;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                }

                .progress-circle {
                    position: absolute;
                    border-radius: 50%;
                    height: 16px;
                    width: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: #fff;
                    box-shadow: rgb(0 0 0 / 10%) -1px 1px 1px;
                    display: none;
                }
                .progress-bar {
                    height: 4px;
                    z-index: 1;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: #fff;
                }
            }

            .timer-container {
                color: #fff;
                max-width: 88px;
                flex: 0 0 88px;
                margin-left: 8px;
                font-size: 1.4rem;
                line-height: 24px;
            }
        }

        .updown-icon-group {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 20px;
            display: flex;
            flex-direction: column;

            .previous,
            .next {
                color: #fff;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgb(255 255 255 / 12%);
            }
            .previous {
                transform: rotateZ(180deg);
                margin-bottom: 16px;
            }
        }

        @media (max-width: 1024px) {
            &.video-container {
                .body {
                    padding: 0;
                }

                .updown-icon-group {
                    left: 20px;
                    right: unset;
                }
                .action-list-wrapper {
                    display: block;
                }
            }
        }

        @media (max-width: 468px) {
            &.video-container {
                .body {
                    padding: 0;

                    .blur-background {
                        display: none;
                    }
                }

                .updown-icon-group {
                    left: 20px;
                    right: unset;

                    .previous {
                        margin-bottom: 16px;
                    }
                }
            }
        }
    }
`;
