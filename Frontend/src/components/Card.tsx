import { DeleteIcon } from "../icons/DeleteIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { TwitterIcon } from "../icons/Twitter";
import { YoutubeIcon } from "../icons/YoutubeIcon";

interface CardProps {
    title: string,
    link: string,
    type: "twitter" | "youtube"
}

const getYouTubeEmbedUrl = (link: string) => {
  const url = new URL(link);
  const videoId = url.searchParams.get("v");
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};

export function Card({ title, link, type }: CardProps) {
    return <div className='flex-col justify-center items-center p-8 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72'>
        <div className="flex justify-between">
            <div className="flex items-center text-md">
                <div className="text-gray-500 pr-2">
                    {type === "youtube" ? <YoutubeIcon /> : <TwitterIcon />}
                </div>
                {title}
            </div>
            <div className="flex items-center">
                <div className="pr-2 text-gray-500">
                    <a href={link} target="_blank">
                        <ShareIcon size="md" />
                    </a>
                </div>
                <div className="text-gray-500">
                    <DeleteIcon />
                </div>
            </div>
        </div>

        <div className="pt-5">
            {
            type === "youtube" && <iframe className="w-full" src={getYouTubeEmbedUrl(link)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            }
        </div>

        <div className="pt-5">
            {
            type === "twitter" && <blockquote className="w-full twitter-tweet">
                <a href={link.replace("x.com", "twitter.com")}></a> 
            </blockquote>
            }
            
        </div>
    </div>
}