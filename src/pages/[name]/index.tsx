import Timeline from "@/components/timeline";
import { useRouter } from "next/router";

function ProfilePage() {
  const router = useRouter();
  const name = router.query.name as string;

  return (
    <div>
      <Timeline
        where={{
          author: {
            name,
          },
        }}
      />
    </div>
  );
}

export default ProfilePage;
