import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TbBrandGithubFilled } from "react-icons/tb";

const Home = () => {
  return (
    <>
      <div className="container mx-auto flex items-center justify-center py-8 h-screen">
        <div className="flex flex-col items-center space-y-4">
          <TbBrandGithubFilled className="text-6xl text-black" />
          <h1 className="text-3xl font-bold text-black">
            Github <span className="text-yellow-500">Stars</span>
          </h1>
          <p className="text-lg text-black">
            Search for a Github user to see their starred repositories
          </p>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input id="username" type="text" placeholder="Username" />
            <Button
              onClick={() => {
                const username = document.getElementById("username").value;
                window.location.href = `/stars/${username}`;
              }}
              type="submit"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
