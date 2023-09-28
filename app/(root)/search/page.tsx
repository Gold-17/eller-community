import UserCard from "@/components/cards/UserCard";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { profileTabs } from "@/constants";
import { fetchAllUsers, fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const results = await fetchAllUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25
  })

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="flex flex-col mt-14 gap-9">
        {results.users.length === 0 ? (
            <p className="no-result">No results</p>
        ) : (
            <>
              {results.users.map((user) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  username={user.username}
                  imgUrl={user.image}
                  personType="User"
                />
              ))}
            </>
        )}
      </div>
    </section>
  );
};

export default Page;
