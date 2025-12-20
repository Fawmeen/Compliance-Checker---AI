import mongoClient from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { pdfToText } from 'pdf-ts'
export async function GET() {
    try {
        const client = await mongoClient;
        const db = await client.db("ComplianceChecker")
        const post = await db.collection("policies").find({}, { projection: { text: 0 } }).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(post)
    }
    catch (err) {
        console.error("Failed to fetch");
        return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const client = await mongoClient;
        const db = client?.db("ComplianceChecker");
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const name = formData.get("name") as string;
        const category = formData.get("Category") as string;
        if (!file || !category || !name) {
            return NextResponse.json({ error: "File, Name, and Category are required" }, { status: 400 });
        }
        console.log("File received:", file.name, "Size:", file.size);
        const text = await pdfToText(buffer);
        console.log("Text extracted length:", text.length);
        console.log(text);
        const collection = db.collection("policies");


        const result = await collection.insertOne({
            name,
            text,
            category,
            status: "ACTIVE",
            indexed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        console.log("Database insert result:", result);
        console.log("Policy inserted into database.");
        return NextResponse.json({ message: "Policy uploaded successfully", id: result.insertedId });
    }
    catch (err: any) {
        console.error("Upload error details:", err);
        return NextResponse.json({ error: "Failed to upload/process policy", details: err.message }, { status: 500 });
    }
}