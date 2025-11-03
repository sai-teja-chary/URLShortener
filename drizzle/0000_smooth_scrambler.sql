CREATE TABLE `email_verification` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(8) NOT NULL,
	`expires_at` timestamp NOT NULL DEFAULT (NOW() + INTERVAL 1 DAY),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shortCode` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	CONSTRAINT `links_id` PRIMARY KEY(`id`),
	CONSTRAINT `links_shortCode_unique` UNIQUE(`shortCode`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`is_valid` boolean NOT NULL DEFAULT true,
	`user+agent` text,
	`ip` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`is_email_verified` boolean NOT NULL DEFAULT false,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `email_verification` ADD CONSTRAINT `email_verification_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `links` ADD CONSTRAINT `links_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;