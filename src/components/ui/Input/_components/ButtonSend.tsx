import classNames from "classnames";
import styles from "@/components/ui/Input/Input.module.scss";
import { Send } from "lucide-react";
import React, { useId } from "react";
import {useFormStatus} from "react-dom";


export default function ButtonSend({ children, ref }) {
  const sendButtonId = useId();
  const {pending} = useFormStatus();
  return (
    <>
      <button
        className={classNames(
          "absolute bottom-2 right-2 rounded-full flex justify-center items-center shadow-md transition-all",
          styles.sendButton,
        )}
        type="submit"
        disabled={pending}
        id={sendButtonId}
      ></button>

      <label
        ref={ref}
        htmlFor={sendButtonId}
        className={classNames("absolute bottom-2 right-2", styles.sendLabel)}
      >
        {children}
      </label>
    </>
  );
}
