export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-2xl rounded-xl w-[1100px] grid grid-cols-2 overflow-hidden">

        {/* Image */}
        <div>
          <img
            src="https://www.manglamgroup.com/wp-content/uploads/2024/01/swimmingpool-Corner-Night_cc.jpg"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="p-10 flex flex-col justify-center">

          {children}

        </div>

      </div>

    </div>
  )
}