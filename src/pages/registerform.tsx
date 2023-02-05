import firebaseApp from "@lib/firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Image from "next/image"
// import { useRouter } from "next/router"
import { Formik, Form } from "formik"
import faculties from "@data/faculties"
import { useEffect, useState } from "react"
import { User as FirebaseUser } from "firebase/auth"
import { createUser } from "@lib/user"
import { TextField } from "@components/common/TextField"
import { SelectField } from "@components/common/SelectField"

export default function Register() {
  const auth = getAuth(firebaseApp)

  const [cred, setCred] = useState<FirebaseUser | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newCredential) => {
      if (cred) {
        return
      }
      if (newCredential) {
        setCred(newCredential)
        unsubscribe()
      }
    })
  }, [])

  // const router = useRouter()

  const handleSubmit = async ({
    nickname,
    name,
    status,
    faculty,
    studentId,
    year,
  }: {
    nickname: string
    name: string
    status: string
    faculty: string
    studentId: string
    year: string
  }) => {
    console.log(nickname, name, status, faculty, studentId, year)

    if (!cred) {
      console.error("Missing credential")
      return
    }

    await createUser(cred, {
      faculty,
      name,
      nickname,
      status: status as "student" | "alumni" | "participant",
      year: +year,
    })
  }

  return (
    <div className="bg-vlvu-pink-100 font-display min-h-screen w-full">
      <main className="text-vlvu-pink-500 mx-auto max-w-lg">
        <div className="flex flex-col items-center justify-center h-screen gap-6">
          <div>
            <Image src="/assets/vlvu-logo.svg" alt="vid love vid u logo" width="96px" height="96px" />
          </div>
          <Formik
            initialValues={{ nickname: "", name: "", status: "", faculty: "", studentId: "", year: "" }}
            validate={(values) => {
              const errors: any = {}

              if (values.faculty == "") {
                errors.faculty = "กรุณาเลือกคณะ"
              }

              if (values.status == "") {
                errors.stutus = "กรุณาเลือกสถานภาพ"
              }

              if (values.status == "student") {
                if (isNaN(+values.studentId) || values.studentId.length != 10) {
                  errors.studentId = "รหัสนิสิตไม่ถูกต้อง"
                }
              } else {
                if (values.studentId != "-") {
                  errors.studentId = "กรอกรหัสนิสิตด้วย '-'"
                }
              }

              if (!(1 <= +values.year && +values.year <= 6)) {
                errors.year = "ชั้นปีไม่ถูกต้อง"
              }

              return errors
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true)

              console.log(values)

              await handleSubmit(values)

              setSubmitting(false)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-2 font-semibold">
                <TextField fieldName="nickname" fieldLabel="ชื่อเล่น" />
                <TextField fieldName="name" fieldLabel="ชื่อ-สกุล" />
                <SelectField
                  fieldLabel="สถานภาพ"
                  fieldName="status"
                  options={[
                    ["นิสิตปัจจุบัน", "student"],
                    ["ศิษย์เก่า", "alumni"],
                    ["ผู้เข้าร่วมงาน", "participant"],
                  ]}
                  placeholder=" "
                  className="w-3/5"
                />
                <TextField fieldName="studentId" fieldLabel="รหัสนิสิต (หากไม่ใช่ -)" />
                <SelectField
                  fieldLabel="คณะ"
                  fieldName="faculty"
                  options={faculties.map((faculty) => [faculty, faculty])}
                  placeholder=" "
                />
                <TextField fieldName="year" fieldLabel="ชั้นปี" className="w-1/5" />
                <button type="submit" disabled={isSubmitting || !cred} className="w-1/6 self-end">
                  ถัดไป
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </div>
  )
}