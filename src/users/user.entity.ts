import { Report } from "../reports/report.entity";
import { OneToMany, AfterRemove, AfterUpdate, AfterInsert, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    email: string;
    
    @Column()
    password: string;

    @Column({ default: true })
    admin: boolean;
    
    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];


    // Lifecycle Hooks (only runs if you create instance before saving in DB)

    @AfterInsert() // Runs after something was inserted in DB
    logInsert() {
        console.log('inserted user with id', this.id);
    }

    @AfterUpdate() // Runs after something was updated in DB
    logUpdate() {
        console.log('updated user with id', this.id)
    }

    @AfterRemove() // Runs after something was removed in DB
    logRemove() {
        console.log('removed user with id', this.id)
    }
}