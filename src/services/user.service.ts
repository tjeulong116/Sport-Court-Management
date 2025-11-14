import getConnection from "../config/database";

const handleCreateUser = async (fullName: string, email: string, address: string) => {
    //insert into database
    const connection = await getConnection();
    try {
        const sql = 'INSERT INTO `users`(`fullName`, `email`, `address`) VALUES (?,?,?)';
        const values = [fullName, email, address];

        const [result, fields] = await connection.execute(sql, values);
    } catch (err) {
        console.log(err);
        return [];
    }

    //return result 
    console.log(">>> insert a new user");
}

const getAllUsers = async () => {
    const connection = await getConnection();

    try {
        const [results, fields] = await connection.query(
            'SELECT * FROM `users`'
        );

        return results;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export { handleCreateUser, getAllUsers };