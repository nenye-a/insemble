# Migration `20200317164228-adjustment-after-tenant-matches-refactor`

This migration has been generated by RaymondAnggara at 3/17/2020, 4:42:28 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Brand" ADD COLUMN "matchId" text   ,
ADD COLUMN "matchingProperties" text   ,
ADD COLUMN "maxSize" integer   ,
ALTER COLUMN "tenantId" DROP NOT NULL,
ALTER COLUMN "tenantId" DROP DEFAULT;

ALTER TABLE "public"."Conversation" DROP COLUMN "matchScore",
ADD COLUMN "matchScore" Decimal(65,30)  NOT NULL DEFAULT 0;

ALTER TABLE "public"."PendingConversation" DROP COLUMN "propertyId",
ADD COLUMN "spaceId" text  NOT NULL DEFAULT '';

CREATE UNIQUE INDEX "Brand.tenantId" ON "public"."Brand"("tenantId")

CREATE UNIQUE INDEX "Brand.matchId" ON "public"."Brand"("matchId")

CREATE UNIQUE INDEX "Space.spaceId" ON "public"."Space"("spaceId")

DROP TABLE "public"."MatchingProperty";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200316133935-add-user-relations..20200317164228-adjustment-after-tenant-matches-refactor
--- datamodel.dml
+++ datamodel.dml
@@ -1,8 +1,8 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = "postgresql://prisma:prisma@localhost:5432/insemble?schema=public"
 }
 generator client {
@@ -38,17 +38,8 @@
   TENANT
   LANDLORD
 }
-model MatchingProperty {
-  id         String @id @default(cuid())
-  propertyId String
-  address    String
-  rent       Int
-  sqft       Int
-  type       String
-}
-
 model Location {
   id      String @id @default(cuid())
   address String
   lat     String
@@ -125,25 +116,24 @@
   commute                String[]
   ethnicity              String[]
   minDaytimePopulation   Int?
   minSize                Int?
+  maxSize                Int?
   minFrontageWidth       Int?
   equipment              String[]
   spaceType              String[]
   locationAndPerformance LocationAndPerformance[]
   matchingLocations      String?
-  matchingProperties     MatchingProperty[]
-  //Tenant Id from tenantMatches django api
-  tenantId               String
+  matchingProperties     String?
+  //Tenant Id(brandId) from tenantMatches django api
+  tenantId               String?                  @unique
+  matchId                String?                  @unique
   createdAt              DateTime                 @default(now())
 }
-
-
-
 model Space {
   id            String   @id @default(cuid())
-  spaceId       String?
+  spaceId       String?  @unique
   mainPhoto     String
   photos        String[]
   description   String
   condition     String
@@ -252,9 +242,9 @@
   landlord    LandlordUser
   messages    Message[]
   brand       Brand
   property    Property
-  matchScore  Int
+  matchScore  Float
   header      String
   createdAt   DateTime     @default(now())
 }
@@ -268,8 +258,8 @@
 model PendingConversation {
   id                       String       @default(cuid()) @id
   pendingConversationData  String
   brandId                  String
-  propertyId               String
+  spaceId                  String
   senderRole               MessageRole
   receiverEmail            String
 }
```


