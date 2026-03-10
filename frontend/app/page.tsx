// import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <div className="main-container" style={{
      display : "flex",
      flexDirection : "row",
      height : "200px",
      width : "200px"
    }}>
    <div style={{
      height : "200px",
      width : "200px"
    }}>
      <Link href={"/admin/register"} >Login as Admin</Link>
    </div>
    <div style={{
      height : "200px",
      width : "200px"
    }}>
      <Link href={"/register"} > Login as resident</Link>
    </div>
    </div>
  );
}
