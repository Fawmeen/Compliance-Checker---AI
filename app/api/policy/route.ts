import mongoClient from "@/lib/mongodb";
import { NextResponse } from "next/server";
import {pdfToText} from 'pdf-ts'
export async function POST(req:Request){
    try{
         const client=await mongoClient;
    const db=client?.db("ComplianceChecker");
    }catch(err){throw new error("Connection failed")}
    const client=await mongoClient;
    const db=client?.db("ComplianceChecker");
    const formData=await req.formData();
    const file=formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
    const name=formData.get("name") as string;
    const category=formData.get("Category") as string;
    if(!file || !category){
        return NextResponse.json({error:"File and Category are required"}, {status:400});
    }
        const text=await pdfToText(buffer);
        console.log(text);
      const collection = db.collection("policies");

try{
await collection.insertOne({
  name,
  text,
  category,        
  status: "ACTIVE",
  indexed: false,
  createdAt: new Date(),
  updatedAt: new Date(),})}
  catch(err){throw new error("Failed to insert")}
    return NextResponse.json({message:"Policy uploaded successfully"});
}