import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";

export default async function IndexPage() {
    const spec = await getApiDocs();

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-3xl font-bold mb-4">API Documentation</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ReactSwagger spec={spec} />
            </div>
        </div>
    );
}
