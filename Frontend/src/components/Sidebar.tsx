import { SidebarItems } from "./SidebarItems"
import { TwitterIcon } from "../icons/Twitter"
import { YoutubeIcon } from "../icons/YoutubeIcon"
import { LogoIcon } from "../icons/Logo"

export function Sidebar() {
    return <div className="h-screen bg-white  w-72 fixed left-0 top-0 border-r border-gray-500 pl-6">
        <div className="flex items-center text-2xl pt-4">
            <div className="pr-3">
                <LogoIcon />
            </div>
            Second Brain
        </div>
        <div className="pt-4">
            <SidebarItems text="Tweets" icon={<TwitterIcon />} />
            <SidebarItems text="Videos" icon={<YoutubeIcon />} />
        </div>
    </div>
}