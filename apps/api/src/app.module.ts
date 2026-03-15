import { Module } from '@nestjs/common';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { DealsModule } from './modules/deals/deals.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    OrganizationsModule,
    UsersModule,
    ContactsModule,
    DealsModule,
    ActivitiesModule,
  ],
})
export class AppModule {}
