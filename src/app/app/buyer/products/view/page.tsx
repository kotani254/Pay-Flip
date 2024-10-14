import Products from "@/app/app/_components/Product";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Products",
};

export default function page() {
	return <Products />;
}