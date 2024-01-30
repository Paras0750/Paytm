import { MouseEvent } from "react";

const Navbar = () => {
  const user = localStorage.getItem("username");
  function handleLogOut(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    localStorage.clear();
    window.location.href = "/signin";
  }

  return (
    <>
      <div className="flex justify-between py-2 px-4">
        <div className="flex items-center">
          <a href="/dashboard">Paytm</a>
        </div>
        <div className="flex gap-2 items-center">
          <div>
            Hello, <span className="font-bold"> {user}</span>
          </div>
          <div className="rounded-full h-10 w-10 md:h-12 md:w-12 bg-slate-200 flex justify-center mt-1 mr-2">
            <div className="flex flex-col justify-center h-full text-xl">
              {user?.[0]}
            </div>
          </div>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      </div>
      <hr />
    </>
  );
};

export default Navbar;
