import Link from "next/link";

export default function DashboardPage() {
    return (
        <div style={{
            display : "flex",
            flexDirection : "column"
        }}>
        Dashboard page for admin
        <Link href={"/admin/profile"}>Admin Profile</Link>
        <Link href={"/admin/flats"}>View all flats</Link>
        <Link href={"/admin/subscription"}> View this admin subscriptions</Link>
        <Link href={"/admin/monthly-records"}> View this monthly records</Link>
        <Link href={"/admin/payment-entry"}> Do payment entry</Link>
        <Link href={"/admin/report"}> View report </Link>
        <Link href={"/admin/notification"}> Send notifications </Link>
        </div>
    )
}