import { BuscarView } from "@/components/buscar/BuscarView";
import { getSearchData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function BuscarPage() {
  const { users, species, pesqueiros } = await getSearchData();
  return <BuscarView users={users} species={species} pesqueiros={pesqueiros} />;
}
