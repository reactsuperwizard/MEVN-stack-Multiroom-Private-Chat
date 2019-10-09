-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 09, 2019 at 05:13 AM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs_chat`
--
CREATE DATABASE IF NOT EXISTS `nodejs_chat` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE `nodejs_chat`;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `content` varchar(1028) COLLATE utf8mb4_bin NOT NULL,
  `room` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `content`, `room`, `user`, `admin`, `createdAt`, `updatedAt`) VALUES
(890, '1user joined 1user\'s changed room', 34, NULL, 1, '2019-10-09 03:10:53', '2019-10-09 03:10:53'),
(891, '2user joined 1user\'s changed room', 34, NULL, 1, '2019-10-09 03:10:55', '2019-10-09 03:10:55'),
(892, 'Hi I am user1!😏', 34, 0, 0, '2019-10-09 03:11:20', '2019-10-09 03:11:20'),
(893, 'I can see. I am user2.😹', 34, 63, 0, '2019-10-09 03:11:36', '2019-10-09 03:11:36'),
(894, '!!!image!!!05fb4770-f1fc-42d8-be4b-5c972967d874.jpg', 34, 0, 0, '2019-10-09 03:11:55', '2019-10-09 03:11:55'),
(895, 'What about image?\n', 34, 0, 0, '2019-10-09 03:12:06', '2019-10-09 03:12:06'),
(896, 'image ok.', 34, 63, 0, '2019-10-09 03:12:15', '2019-10-09 03:12:15'),
(897, '!!!image!!!47323b7f-5d16-45c2-9cf6-1ed27032c0ae.jpg', 34, 63, 0, '2019-10-09 03:12:20', '2019-10-09 03:12:20'),
(898, '2user updated room 1user\'s changed room to 2user changed Room', 34, 63, 1, '2019-10-09 03:12:53', '2019-10-09 03:12:53'),
(899, 'I can see room name changed.', 34, 0, 0, '2019-10-09 03:13:07', '2019-10-09 03:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `user` varchar(11) DEFAULT NULL,
  `password` varchar(50) DEFAULT '',
  `access` tinyint(1) NOT NULL DEFAULT '1',
  `accessIds` varchar(250) DEFAULT NULL,
  `users` varchar(250) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `user`, `password`, `access`, `accessIds`, `users`, `createdAt`, `updatedAt`) VALUES
(34, '2user changed Room', '0', NULL, 1, NULL, NULL, '2019-10-09 03:12:53', '2019-10-09 03:12:53'),
(35, '2user\'s room', '63', NULL, 1, NULL, NULL, '2019-10-08 11:29:54', '2019-10-08 11:29:54');

-- --------------------------------------------------------

--
-- Table structure for table `user_infos`
--

DROP TABLE IF EXISTS `user_infos`;
CREATE TABLE `user_infos` (
  `id` int(11) NOT NULL,
  `socketid` char(255) DEFAULT NULL,
  `username` varchar(20) NOT NULL,
  `handle` varchar(50) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(255) NOT NULL,
  `create_time` text,
  `delete_time` text,
  `image` varchar(250) DEFAULT NULL,
  `age` int(2) DEFAULT NULL,
  `sex` varchar(50) DEFAULT NULL,
  `location` varchar(50) DEFAULT '',
  `bio` varchar(240) DEFAULT '',
  `status_active` int(11) NOT NULL DEFAULT '0',
  `status_participate` int(11) NOT NULL DEFAULT '0',
  `room_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_infos`
--

INSERT INTO `user_infos` (`id`, `socketid`, `username`, `handle`, `email`, `password`, `create_time`, `delete_time`, `image`, `age`, `sex`, `location`, `bio`, `status_active`, `status_participate`, `room_id`, `createdAt`, `updatedAt`) VALUES
(0, '7fhKsYFV5f4GWAXmAAAE', '1user', '1user', '1user@email.com', '$2a$10$bhaWZMo7zLZoEcC1WOgk8Ow.Z2v5mbr8J40gtFRAC1r8.zNqd21Ry', '2019-10-07 15:21:35', NULL, 'c988577f-6910-4e4b-a094-f5e339769fc3.jpg', 19, 'female', 'I live in 1user\'s house.', 'I am a 19 years old girl.', 0, 0, 34, '2019-10-09 03:10:53', '2019-10-09 03:10:53'),
(63, 'prqCoE7rwzM2jDwAAAAF', '2user', '2user', '2user@email.com', '$2a$10$oKMeKM.TX9v2kemlZ7SzrugHP3XuoXrbU.oenUObNeGnNUPhB6oKO', '2019-10-08 06:01:13', NULL, '3d0a47fb-4d41-4be4-a8ed-cc6a6b7aa30a.jpg', 24, 'female', '2user\'s house', 'i live here.', 0, 0, 34, '2019-10-09 03:10:55', '2019-10-09 03:10:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_infos`
--
ALTER TABLE `user_infos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=900;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `user_infos`
--
ALTER TABLE `user_infos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
