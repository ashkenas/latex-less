# Database Schema

## Objects

```
User {
    _id: ObjectId,
    firebaseId: string,
    equations: Equation[],
    projects: Project[]
}
```
```
Equation {
    _id: ObjectId,
    name: string,
    text: string
}
```
```
Project {
    _id: ObjectId,
    name: string,
    equations: Equation[],
    responses: Response[]
}
```
```
Response {
    _id: ObjectId,
    name: string,
    text: string
}
```
## Collections
 - Users