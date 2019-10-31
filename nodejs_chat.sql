-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 31, 2019 at 05:01 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
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

INSERT INTO `rooms` (`id`, `name`, `image`, `user`, `password`, `access`, `accessIds`, `users`, `createdAt`, `updatedAt`) VALUES
(40, ' private room', NULL, NULL, NULL, 0, NULL, NULL, '2019-10-09 15:18:38', '2019-10-09 14:40:18'),
(44, 'Room3', NULL, '92', NULL, 1, NULL, NULL, '2019-10-29 03:42:07', '2019-10-29 03:42:07');

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
(81, 'VDBM-E9h9dPzyENtAAAT', '1user', '1user', '1user@email.com', '$2a$10$koXfwebbigA9I9it.dbohespW5G7bvW/HRb3vV9.N1RrNbo9zsosG', '2019-10-25 09:17:57', NULL, '//www.gravatar.com/avatar/52136435f4a0135ba0f4e8cf78fdd095?s=220&r=pg&d=identicon', NULL, NULL, '', '', 0, 0, NULL, '2019-10-31 14:29:46', '2019-10-31 14:29:46'),
(91, 'gslVCm90BCyJ8CsTAAAC', '2user', '2user', '2user@email.com', '$2a$10$Lzwy4MLwRgj5fWpczw.1b.75RJLhI7X99R6whDiOSSktRJyqHj30y', '2019-10-25 17:58:35', NULL, '//www.gravatar.com/avatar/d920d7080934a66a52a5d2c6c8182376?s=220&r=pg&d=identicon', NULL, NULL, '', '', 0, 0, NULL, '2019-10-29 03:36:47', '2019-10-28 17:52:31'),
(92, 'mb7RDEpaaZzwJHkXAAAU', '3user', '3user', '3user@email.com', '$2a$10$1DeLVxRxJseByr8GI/xveub6lumO45rK0HnQX9WvR1tLIBIJPny5a', '2019-10-28 12:32:06', NULL, '//www.gravatar.com/avatar/4ffe1708aceffd18c519ebf26af314c2?s=220&r=pg&d=identicon', NULL, NULL, '', '', 0, 0, 44, '2019-10-31 14:25:39', '2019-10-31 14:25:39'),
(93, 'qYQ7OyLa_wHKBx9cAAAV', '4user', '4user', '4user@email.com', '$2a$10$7nbnibO0WAqeBX5Rm2Yz.Oi073bnn20BN55TXXRPGwcI8XWr8n7b.', '2019-10-31 09:49:42', NULL, '//www.gravatar.com/avatar/e4aab9b913135c8709ab79d3204cf57c?s=220&r=pg&d=identicon', NULL, NULL, '', '', 0, 0, 44, '2019-10-31 14:26:55', '2019-10-31 14:26:55');

--
-- Indexes for dumped tables
--

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_relations`
--
ALTER TABLE `room_relations`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3044;

--
-- AUTO_INCREMENT for table `privatemessages`
--
ALTER TABLE `privatemessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=841;

--
-- AUTO_INCREMENT for table `relations`
--
ALTER TABLE `relations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `room_relations`
--
ALTER TABLE `room_relations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_infos`
--
ALTER TABLE `user_infos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
