import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const conection: ConnectionObject={}

async function dbConnect():Promise<void>{
    if(conection.isConnected){
        console.log("Database is already connected");
        return
    }

    try {
        const db = await mongoose.connect(process.env.DB_HOST || '',{})
        conection.isConnected = db.connections[0].readyState;

        console.log('DB connected successfully')
    } catch (error) {
        console.log('DB connection failed',error);
        process.exit(1)
    }
}

export default dbConnect