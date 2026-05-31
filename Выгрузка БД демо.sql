-- phpMyAdmin SQL Dump
-- Версия сервера: 8.0.34-26-beget-1-1
-- Версия PHP: 7.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- База данных: `demo_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `custom_orders`
--

DROP TABLE IF EXISTS `custom_orders`;
CREATE TABLE `custom_orders` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `status` enum('new','processing','completed','cancelled') DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `order_number` varchar(20) DEFAULT NULL,
  `order_data` json NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('new','confirmed','in_progress','delivered','cancelled') DEFAULT 'new',
  `delivery_type` enum('delivery','pickup') NOT NULL,
  `delivery_address` text,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `delivery_time` varchar(20) DEFAULT NULL,
  `card_message` text,
  `comments` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `phone` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Структура таблицы `wheel_prizes`
--

DROP TABLE IF EXISTS `wheel_prizes`;
CREATE TABLE `wheel_prizes` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `prize` varchar(10) NOT NULL,
  `prize_name` varchar(100) NOT NULL,
  `promo_code` varchar(50) NOT NULL,
  `discount` int NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `used_at` datetime DEFAULT NULL,
  `week_key` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Индексы
--

ALTER TABLE `custom_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_number` (`order_number`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `wheel_prizes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_week_user` (`user_id`,`week_key`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT
--

ALTER TABLE `custom_orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `wheel_prizes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

COMMIT;