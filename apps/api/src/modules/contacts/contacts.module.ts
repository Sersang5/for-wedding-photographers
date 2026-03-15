import { Module } from '@nestjs/common';
import { ContactsController } from './api/contacts.controller';
import { ContactsService } from './application/contacts.service';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
