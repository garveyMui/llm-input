import {useState} from "react";
import {NetworkMessageI, postMessageStreaming, RenderMessageI, retryPostMessageStreaming} from "@/store/Messages";
import {PayloadAction} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {RootState, useTypedSelector} from "@/store";

export const useChatItemActionsBar = () => {
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [copied, setCopied] = useState(false);
    const dispatch = useDispatch();
    const { messagesList: history } = useTypedSelector(
        (state: RootState) => state.messages,
    );
    const handleRetry = (index: number) => {
        dispatch(
            (retryPostMessageStreaming(index, history) as PayloadAction<number, Array<RenderMessageI>>)
        );
    };
    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content).then(
            () => {
                console.log("Text copied to clipboard");
                setCopied(true); // 显示浮窗
                setTimeout(() => setCopied(false), 2000); // 2 秒后隐藏
            },
            (error) => {
                console.error("Failed to copy text: ", error);
            }
        )
    };
    const handleLikeClick = () => {
        setIsLiked(!isLiked);
        setIsDisliked(false);
    };
    const handleDislikeClick = () => {
        setIsDisliked(!isDisliked);
        setIsLiked(false);
    };
    return {
        handleRetry,
        isLiked,
        isDisliked,
        handleCopy,
        handleLikeClick,
        handleDislikeClick,
        copied,
    }
}

export default useChatItemActionsBar;