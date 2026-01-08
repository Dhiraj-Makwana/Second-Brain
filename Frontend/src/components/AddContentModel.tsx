import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../../config";
import axios from "axios";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

export function AddContentModel({open, onClose}: {open: boolean, onClose: () => void}) {
    const titleRef = useRef<HTMLInputElement>(null)
    const linkRef = useRef<HTMLInputElement>(null)
    const [type, setType] = useState(ContentType.Youtube)

    async function addContent() {
        const title = titleRef.current?.value
        const link = linkRef.current?.value

        await axios.post(`${BACKEND_URL}/api/v1/content`, {
            title: title,
            link: link,
            type: type
        }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        onClose()
    }

    return <div>
        {open && <div onClick={onClose} className="w-screen h-screen bg-slate-950/50 fixed top-0 left-0 flex justify-center">
            <div className="flex flex-col justify-center">
                <span onClick={(e) => e.stopPropagation()} className="bg-white opacity-100 p-4 rounded">
                    <div className="flex justify-end">
                        <div onClick={onClose} className="cursor-pointer">
                            <CrossIcon size="md" />
                        </div>
                    </div>
                    <div>
                        <Input reference={titleRef} placeholder={"Title"} />
                        <Input reference={linkRef} placeholder={"Link"} />
                    </div>
                    <h1>Type</h1>
                    <div className="flex gap-1 p-4">
                        <Button onClick={() => {
                            setType(ContentType.Youtube)
                        }} text="Youtube" variant={type === ContentType.Youtube ? "primary" : "secondary"}></Button>
                        <Button onClick={() => {
                            setType(ContentType.Twitter)
                        }} text="Twitter" variant={type === ContentType.Twitter ? "primary" : "secondary"}></Button>
                    </div>
                    <div className="flex justify-center">
                    <Button onClick={addContent} variant="primary" text="Submit" />
                    </div>
                </span>
            </div>
        </div>}
    </div>
}