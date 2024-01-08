import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

import { ServerSidebar } from '@/components/server/server-sidebar'

import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { serverId: string }
}) => {
  const profile = await currentProfile()
  if (!profile) {
    return redirectToSignIn()
  }
  const server = db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })
  if (!server) {
    redirect('/')
  }
  return (
    <div className='h-full'>
      <div className='fixed hidden md:flex w-60 h-full flex-col z-20 inset-y-0'>
        {/* @ts-expect-error Server Component */}
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  )
}

export default ServerIdLayout
