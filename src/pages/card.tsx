import { FlowerType, getFlowerType } from "@/data/flower"
import { Ticket } from "@/components/common/Ticket"
import { useRouter } from "next/router"
import { SVGAttributes, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button, LinkButton } from "@/components/common/Button"
import { motion } from "framer-motion"

import ChevRonLeftIcon from "@heroicons/react/24/solid/ChevronLeftIcon"
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon"
import DownloadIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon"
import SignOutIcon from "@heroicons/react/24/solid/ArrowLeftOnRectangleIcon"
import MapIcon from "@heroicons/react/24/solid/MapIcon"

export default function Card() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    auth?.requireCred("/register")
    auth?.requireUser("/registerform")
    auth?.requireGame("/game")
  }, [])

  if (!auth?.loading && !auth?.user?.score) {
    router.push("/game")
  }

  return (
    <div className="bg-vlvu-pink-100 min-h-screen flex flex-col justify-center items-center pt-20 sm:pt-6 pb-20 font-display">
      <div className="flex justify-end absolute top-0 w-full z-50 p-6">
        <Button
          onClick={() => {
            auth?.signout("/")
          }}
          type="white"
          className="shadow-md w-[10rem] px-0 py-3 text-sm flex gap-1 justify-center items-center"
        >
          <SignOutIcon className="w-5 h-5 text-vlvu-pink-500" />
          <span>ออกจากระบบ</span>
        </Button>
      </div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Ticket
          nickname={(auth?.user?.nickname as string) ?? ""}
          flower={getFlowerType(auth?.user?.score ?? 0) as FlowerType}
          uid={(auth?.credential?.uid as string) ?? ""}
        />
      </motion.div>

      <section className="grid grid-cols-2 gap-2 mt-4 max-w-xs w-full">
        <LinkButton
          href="/game"
          type="secondary"
          className="shadow-md px-0 py-3 w-full flex gap-1 justify-center items-center"
        >
          <ChevRonLeftIcon className="w-5 h-5 text-white" />
          <span>ดูคำทำนาย</span>
        </LinkButton>
        <Button
          onClick={() => {
            // download from /api/og
            const a = document.createElement("a")
            a.href = `/api/og?uid=${auth?.credential?.uid}&name=${auth?.user?.nickname}&type=${getFlowerType(
              auth?.user?.score ?? 0
            )}`

            a.download = "vlvu.png"
            a.click()
          }}
          type="white"
          className="shadow-md px-0 py-3 w-full flex gap-1 justify-center items-center"
        >
          <DownloadIcon className="w-6 h-6 text-vlvu-pink-500" />
          <span>ดาวน์โหลด</span>
        </Button>
      </section>

      <section className="flex flex-col gap-2 max-w-xs w-full mt-4">
        <LinkButton
          href="/estamp"
          type="secondary"
          className="shadow-md px-0 py-3 w-full flex gap-1 justify-center items-center"
        >
          <MapIcon className="w-5 h-5 text-white" />
          <span>E-Stamp</span>
        </LinkButton>

        <LinkButton
          href="https://docs.google.com/forms/d/e/1FAIpQLSe54R9IrfKY0p3xyKqdcAmnCE2bvzWG1heVe4R0z-4_8R22VA/viewform"
          type="white"
          className="shadow-md px-0 py-3 w-full flex gap-1 justify-center items-center"
        >
          <CheckCircleIcon className="w-5 h-5 text-vlvu-pink-500" />
          <span>แบบประเมินความพึงพอใจ</span>
        </LinkButton>
      </section>
    </div>
  )
}
