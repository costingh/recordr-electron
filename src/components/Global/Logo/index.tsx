function Logo() {
	return (
		<a
			className="flex shrink-0 items-center gap-2"
			title="Recordr homepage"
			href="/"
		>
			<img alt="Recordr Logo" src="/logo.png" className="w-[15px]" />
			<span className="text-[12px] font-[400] text-white">Recordr</span>
		</a>
	);
}

export default Logo;
