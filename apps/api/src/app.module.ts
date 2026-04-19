import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { DealsModule } from './modules/deals/deals.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PacksModule } from './modules/packs/packs.module';
import { UsersModule } from './modules/users/users.module';
import { WeddingStatesModule } from './modules/wedding-states/wedding-states.module';
import { WeddingsModule } from './modules/weddings/weddings.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    ContactsModule,
    DealsModule,
    ActivitiesModule,
    WeddingsModule,
    WeddingStatesModule,
    PacksModule,
  ],
})
export class AppModule {}
