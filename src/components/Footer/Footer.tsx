import logo from "../../assets/lamma-circles.svg"
export default function Footer() {
  return (
<footer className="border-t border-[#DDD9F7] bg-white">
  <div className="mx-auto flex max-w-280 flex-col gap-2.5 px-6 py-8">
    <div className="flex items-center gap-2.5">
<img src={logo} alt="logo"className="w-[36px] h-[28px]"  />
      <span className="text-[22px] font-bold">Lamma</span>
    </div>
    <p className="max-w-xs text-[15px] leading-normal text-[#5B5878]">
      Gather your people. Share the little things.
    </p>
  </div>
  <div className="border-t border-[#DDD9F7]">
    <div className="mx-auto max-w-280 px-6 py-4 text-sm text-[#5B5878]">
      © 2026 Lamma. Made for friends.
    </div>
  </div>
</footer>

  )
}
