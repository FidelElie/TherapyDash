import Link from "next/link";

const DashboardCard = (props: any) => {
  const { title, href, hrefMessage, children } = props;

  return (
    <div className="w-1/3 h-80 box-border px-5 py-2">
      <div className="card w-full h-full items-center justify-center overflow-hidden flex flex-col">
        <div className="bg-primary text-tertiary p-5 w-full text-center flex justify-between items-center h-1/4 flex-shrink-0">
          <span className="text-2xl tracking-tighter font-semibold">{ title }</span>
          { href && (
            <Link href={href}>
              <a className="py-2 px-3 h-12 text-white rounded-md bg-secondary flex items-center justify-center">
                { hrefMessage ? hrefMessage : "To Page" }
              </a>
            </Link>
          ) }
        </div>
        <div className="px-5 py-2 box-border w-full h-3/4 items-center justify-center flex">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardCard;
