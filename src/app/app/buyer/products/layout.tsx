import Header from "@/components/layout/Header";
import Sider from "@/components/layout/Sider";
import { FC, ReactNode } from "react";

interface AdminLayoutProps {
	children: ReactNode | ReactNode[];
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
	return (
		<div className="flex flex-col flex-1 transition-all bg-[#FFF] ">
			<div className="flex flex-1 flex-col md:flex-row">
				<Sider />
				<div className="flex flex-1 flex-col px-2 md:px-[30px] py-5 overflow-y-auto h-screen">
					<Header />
					{children
					}</div>
			</div>
		</div>
	);
};

export default AdminLayout;
