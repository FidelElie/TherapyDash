import Link from "next/link";

const DashboardCard = (props: any) => {
  const { title, href, hrefMessage, children } = props;

  return (
    <div className="w-1/3 h-80 box-border p-5">
      <div className="card w-full h-full items-center justify-center overflow-hidden flex flex-col">
        <div className="bg-primary text-tertiary p-5 w-full text-center flex justify-between items-center h-20">
          <span className="text-2xl tracking-tighter font-semibold">{ title }</span>
          { href && (
            <Link href={href}>
              <a className="py-2 px-3 h-12 text-white rounded-md bg-secondary flex items-center justify-center">
                { hrefMessage ? hrefMessage : "To Page" }
              </a>
            </Link>
          ) }
        </div>
        <div className="p-5 box-border w-full flex-grow items-center justify-center flex">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardCard;
