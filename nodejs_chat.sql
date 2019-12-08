-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2019 at 03:43 PM
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
-- Table structure for table `adsenses`
--

DROP TABLE IF EXISTS `adsenses`;
CREATE TABLE `adsenses` (
  `id` int(11) NOT NULL,
  `chatInputClientId` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `chatInputSlotId` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `sidebarClientId` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `sidebarSlotId` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `adsenses`
--

INSERT INTO `adsenses` (`id`, `chatInputClientId`, `chatInputSlotId`, `sidebarClientId`, `sidebarSlotId`, `createdAt`, `updatedAt`) VALUES
(1, '4125889001430424', '5349526397', '4125889001430424', '5349526397', '2019-12-08 14:14:57', '0000-00-00 00:00:00');

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

-- --------------------------------------------------------

--
-- Table structure for table `privatemessages`
--

DROP TABLE IF EXISTS `privatemessages`;
CREATE TABLE `privatemessages` (
  `id` int(11) NOT NULL,
  `content` varchar(1026) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `user` int(11) NOT NULL,
  `touser` int(11) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `relations`
--

DROP TABLE IF EXISTS `relations`;
CREATE TABLE `relations` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `touser` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `relations`
--

INSERT INTO `relations` (`id`, `user`, `touser`, `status`) VALUES
(9, 3, 1, 0),
(10, 2, 1, 0),
(11, 3, 2, 0),
(12, 1, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `avatar` varchar(250) NOT NULL,
  `user` varchar(11) DEFAULT NULL,
  `password` varchar(50) DEFAULT '',
  `access` tinyint(1) NOT NULL DEFAULT '1',
  `lastAcTime` timestamp NULL DEFAULT NULL,
  `users` varchar(250) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `avatar`, `user`, `password`, `access`, `lastAcTime`, `users`, `createdAt`, `updatedAt`) VALUES
(1, 'Private Room', 'pHome.png', NULL, NULL, 0, NULL, NULL, '2019-11-11 06:17:18', '2019-10-09 06:40:18'),
(2, 'HOME', 'home.png', 'NULL', NULL, 1, NULL, NULL, '2019-12-08 14:39:02', '2019-12-08 14:39:02');

-- --------------------------------------------------------

--
-- Table structure for table `room_relations`
--

DROP TABLE IF EXISTS `room_relations`;
CREATE TABLE `room_relations` (
  `id` int(11) NOT NULL,
  `room` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `user_infos`
--

DROP TABLE IF EXISTS `user_infos`;
CREATE TABLE `user_infos` (
  `id` int(11) NOT NULL,
  `socketid` char(255) DEFAULT NULL,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `handle` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
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
(1, 'q1VZJxyym57L7weNAAAF', 'cat1', 'cat1', 'cat1@email.com', '$2a$10$sO7h/uIzDZx6GvbIVnEl9OWeZEH85.RqGHQMddLNzhr7dVtCjaWKW', '2019-12-07 15:04:28', NULL, '//www.gravatar.com/avatar/4fc3103a0027f9ad4e3f6f37debe8e52?s=220&r=pg&d=identicon', NULL, NULL, '', '', 1, 0, NULL, '2019-12-08 14:38:54', '2019-12-08 14:38:54'),
(2, 'TZrt8AfJxMfaGij7AAAG', 'cat2', 'cat2', 'cat2@email.com', '$2a$10$jhECiO2BD4DmgXIdwKO9t.GbTawjX7ka2ZwasuQdr.8WRJKGKZdty', '2019-12-07 15:04:36', NULL, '//www.gravatar.com/avatar/6312d7776c273231bb2743d1e3ee952c?s=220&r=pg&d=identicon', NULL, NULL, '', '', 1, 0, 2, '2019-12-08 14:39:02', '2019-12-08 14:39:02'),
(3, 'JUA9EVf7v0rWvYn2AAAH', 'cat3', 'cat3', 'cat3@a.com', '$2a$10$0wIfQl0igwWP.HcS.3Pn0eaCSquaT8nrV74yaUyI6zF2SRFZOwAfy', '2019-12-07 15:09:06', NULL, '//www.gravatar.com/avatar/f12f252dc48684c3ff33367291bef7e0?s=220&r=pg&d=identicon', NULL, NULL, '', '', 1, 0, NULL, '2019-12-08 14:38:53', '2019-12-08 14:38:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adsenses`
--
ALTER TABLE `adsenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `privatemessages`
--
ALTER TABLE `privatemessages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `relations`
--
ALTER TABLE `relations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `room_relations`
--
ALTER TABLE `room_relations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_infos`
--
ALTER TABLE `user_infos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `socketid` (`socketid`),
  ADD KEY `handle` (`handle`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adsenses`
--
ALTER TABLE `adsenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

--
-- AUTO_INCREMENT for table `privatemessages`
--
ALTER TABLE `privatemessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `relations`
--
ALTER TABLE `relations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `room_relations`
--
ALTER TABLE `room_relations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_infos`
--
ALTER TABLE `user_infos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
