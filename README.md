# AgroLink Backend — Java / Spring Boot / MySQL

This is the MySQL version of the AgroLink Java backend — same 29 API endpoints, same JSON contract for
your React frontend, but using **MySQL + JPA/Hibernate** instead of MongoDB.

## What changed from the MongoDB version

| Area | MongoDB version | MySQL version |
|---|---|---|
| Models | `@Document`, MongoDB documents | `@Entity`, JPA/Hibernate, actual SQL tables |
| Repositories | `MongoRepository` | `JpaRepository` |
| Product image list | Native array field | Separate `product_images` linked table (`@ElementCollection`) - MySQL has no native array column |
| Dynamic product search/filter | `MongoTemplate` criteria queries | JPQL query with nullable-parameter pattern (`ProductRepository.search()`) |
| Chat threads grouping | `MongoTemplate` query + Java grouping | Plain JPQL query + same Java grouping logic |
| Config file | `application.yml` (Mongo URI) | `application.properties` (JDBC URL, username, password) |
| Primary keys | Mongo's internal `_id` + separate business ID | The business ID itself (e.g. `userId`, `productId`) is now the SQL primary key directly |

**No changes were needed** in any controller, DTO, security/JWT code, or the Payment/AI/Report services -
they only talk to the database through repositories/services, so they didn't care which database was underneath.

## Environment variables needed

```
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_DB=agrolink
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
JWT_SECRET=your_secret_here
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
CORS_ORIGINS=https://your-frontend.vercel.app
ANTHROPIC_API_KEY=sk-ant-...
```

## Tables created automatically

On first run, Hibernate (via `spring.jpa.hibernate.ddl-auto=update`) automatically creates these tables -
you don't need to write any CREATE TABLE SQL yourself:
- users
- products (+ product_images for the image list)
- orders
- reviews
- messages
- user_sessions

## Running locally

Requires Java 17+, Maven, and a running MySQL server.

1. Make sure MySQL is running and you've created an empty database: `CREATE DATABASE agrolink;`
2. Edit src/main/resources/application.properties - set environment variables before running, or
   temporarily hardcode values directly in that file for local testing.
3. Build and run:
   ```
   mvn clean package -DskipTests
   java -jar target/agrolink-backend.jar
   ```
4. Test at http://localhost:8000/api/

## Deploying

Same process as the MongoDB version on Render - add the MySQL environment variables instead of Mongo
ones. Render also offers managed MySQL databases if you don't already have one hosted elsewhere.

## Not compile-tested here

This sandbox has no internet access to download Maven dependencies, so this couldn't be built/run in
this environment. Please run `mvn clean package` yourself and send any compiler errors - they're
usually quick fixes.
