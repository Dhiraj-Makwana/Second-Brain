import { useEffect, useState } from 'react'
import { AddContentModel } from '../components/AddContentModel'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Sidebar } from '../components/Sidebar'
import { useContent } from '../hooks/useContent'
import axios from 'axios'
import { BACKEND_URL } from '../../config'

export function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false)
  const {contents, refresh} = useContent()

  useEffect(() => {
    refresh()
  }, [modelOpen, refresh])

  return (
    <div>
      <Sidebar />
    <div className="p-4 ml-72 min-h-screen bg-gray-200">
      <AddContentModel open={modelOpen} onClose={() => {
        setModelOpen(false)
      }} />
      <div className="flex justify-end">
        <Button onClick={() => {
          setModelOpen(true)
        }} variant="primary" text="Add Content" startIcon={<PlusIcon size="md" />}></Button>
        <Button onClick={async () => {
            const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                share: true
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })
            const shareUrl = `http://localhost:5173/share/${response.data.hash}`
            alert(shareUrl)
        }} variant="secondary" text="Share Brain" startIcon={<ShareIcon size="md" />}></Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {contents.map(({ title, link, type}) => <Card 
        title={title}
        link={link}
        type={type} />)}
      </div>     
    </div>
   </div>
  )
}

export default Dashboard
