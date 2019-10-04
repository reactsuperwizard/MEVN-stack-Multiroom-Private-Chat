-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2019 at 05:39 PM
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
CREATE DATABASE IF NOT EXISTS `nodejs_chat` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `nodejs_chat`;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `content` varchar(1028) NOT NULL,
  `room` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `content`, `room`, `user`, `admin`, `createdAt`, `updatedAt`) VALUES
(297, '1user joined 1user\'s room', 19, NULL, 1, '2019-10-04 14:24:17', '2019-10-04 14:24:17'),
(298, '2user joined 1user\'s room', 19, NULL, 1, '2019-10-04 14:24:21', '2019-10-04 14:24:21'),
(299, '3user joined 1user\'s room', 19, NULL, 1, '2019-10-04 14:24:25', '2019-10-04 14:24:25'),
(300, 'Hi there', 19, 52, 0, '2019-10-04 14:24:35', '2019-10-04 14:24:35'),
(301, 'Yes', 19, 53, 0, '2019-10-04 14:24:40', '2019-10-04 14:24:40'),
(302, 'I can see you all.', 19, 54, 0, '2019-10-04 14:24:51', '2019-10-04 14:24:51'),
(303, 'great', 19, 52, 0, '2019-10-04 14:24:56', '2019-10-04 14:24:56'),
(304, '1user joined 1user\'s room', 19, NULL, 1, '2019-10-04 14:25:14', '2019-10-04 14:25:14'),
(305, '222', 19, 52, 0, '2019-10-04 14:25:19', '2019-10-04 14:25:19'),
(306, '2user joined 1user\'s room', 19, NULL, 1, '2019-10-04 14:25:21', '2019-10-04 14:25:21'),
(307, '3user joined 1user\'s room', 19, NULL, 1, '2019-10-04 14:25:23', '2019-10-04 14:25:23'),
(308, 'abc', 19, 52, 0, '2019-10-04 14:25:24', '2019-10-04 14:25:24'),
(309, '222', 19, 53, 0, '2019-10-04 14:25:27', '2019-10-04 14:25:27'),
(310, '1user joined 1user\'s second room', 20, NULL, 1, '2019-10-04 14:25:32', '2019-10-04 14:25:32'),
(311, 'aaa', 20, 52, 0, '2019-10-04 14:25:34', '2019-10-04 14:25:34'),
(312, 'abc', 20, 52, 0, '2019-10-04 14:25:36', '2019-10-04 14:25:36'),
(313, 'ddd', 20, 52, 0, '2019-10-04 14:25:38', '2019-10-04 14:25:38'),
(314, 'abc', 19, 53, 0, '2019-10-04 14:25:41', '2019-10-04 14:25:41'),
(315, '3434', 19, 54, 0, '2019-10-04 14:25:44', '2019-10-04 14:25:44'),
(316, '2user joined 1user\'s second room', 20, NULL, 1, '2019-10-04 14:25:51', '2019-10-04 14:25:51'),
(317, '3user joined 1user\'s second room', 20, NULL, 1, '2019-10-04 14:25:53', '2019-10-04 14:25:53'),
(318, '32424', 20, 52, 0, '2019-10-04 14:25:56', '2019-10-04 14:25:56'),
(319, 'abc', 20, 53, 0, '2019-10-04 14:25:58', '2019-10-04 14:25:58'),
(320, '3434', 20, 54, 0, '2019-10-04 14:25:59', '2019-10-04 14:25:59'),
(321, 'abc', 20, 52, 0, '2019-10-04 14:27:21', '2019-10-04 14:27:21'),
(322, '1user joined 1user\'s second room', 20, NULL, 1, '2019-10-04 14:27:23', '2019-10-04 14:27:23'),
(323, '2user joined 1user\'s second room', 20, NULL, 1, '2019-10-04 14:27:24', '2019-10-04 14:27:24'),
(324, '3user joined 1user\'s second room', 20, NULL, 1, '2019-10-04 14:27:25', '2019-10-04 14:27:25'),
(325, 'asd', 20, 52, 0, '2019-10-04 14:27:27', '2019-10-04 14:27:27'),
(326, 'asd', 20, 53, 0, '2019-10-04 14:27:29', '2019-10-04 14:27:29'),
(327, 'abc', 20, 54, 0, '2019-10-04 14:27:30', '2019-10-04 14:27:30'),
(328, '1user left 1user\'s second room', 20, NULL, 1, '2019-10-04 14:27:32', '2019-10-04 14:27:32'),
(329, '1user joined 1user\'s second room', 20, NULL, 1, '2019-10-04 14:27:43', '2019-10-04 14:27:43'),
(330, '222', 20, 52, 0, '2019-10-04 14:27:46', '2019-10-04 14:27:46'),
(331, 'abc', 20, 53, 0, '2019-10-04 14:27:49', '2019-10-04 14:27:49'),
(332, '4334', 20, 54, 0, '2019-10-04 14:27:51', '2019-10-04 14:27:51'),
(333, '1user left 1user\'s second room', 20, NULL, 1, '2019-10-04 14:28:03', '2019-10-04 14:28:03'),
(334, '3user left 1user\'s second room', 20, NULL, 1, '2019-10-04 14:34:46', '2019-10-04 14:34:46'),
(335, '2user left 1user\'s second room', 20, NULL, 1, '2019-10-04 14:35:00', '2019-10-04 14:35:00'),
(336, '1user joined 1user\'s room', 19, NULL, 1, '2019-10-04 14:36:16', '2019-10-04 14:36:16'),
(337, '1user left 1user\'s room', 19, NULL, 1, '2019-10-04 14:36:38', '2019-10-04 14:36:38');

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
(19, '1user\'s room', '52', NULL, 1, NULL, NULL, '2019-10-04 14:21:16', '2019-10-04 14:21:16'),
(20, '1user\'s second room', '52', NULL, 1, NULL, NULL, '2019-10-04 14:21:30', '2019-10-04 14:21:30'),
(21, '2user\'s room', '53', NULL, 1, NULL, NULL, '2019-10-04 14:21:51', '2019-10-04 14:21:51'),
(22, '3user\'s room', '54', NULL, 1, NULL, NULL, '2019-10-04 14:23:54', '2019-10-04 14:23:54');

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
  `room_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_infos`
--

INSERT INTO `user_infos` (`id`, `socketid`, `username`, `handle`, `email`, `password`, `create_time`, `delete_time`, `image`, `age`, `sex`, `location`, `bio`, `status_active`, `status_participate`, `room_id`, `createdAt`, `updatedAt`) VALUES
(52, '1yiiwSupZj9LFUQpAAAD', '1user', '1user', '1user@email.com', '$2a$10$vV1bt.0A0uOKPMHXqmWs5.ciMIpMxuHRD.Y2ZvlkJxEJk9hzi2b0.', '2019-10-03 04:29:45', NULL, '//www.gravatar.com/avatar/52136435f4a0135ba0f4e8cf78fdd095?s=220&r=pg&d=identicon', NULL, NULL, '', '', 0, 0, 0, '2019-10-04 14:36:38', '2019-10-04 14:36:38'),
(53, 'uotIxBKw8VNiXTuHAAAE', '2user', '2user', '2user@email.com', '$2a$10$0jVamfbJWdoL.OM0cC8.F.T9fg5dOUre.dW37goSK5kahDBc3bCNK', '2019-10-03 04:39:36', NULL, '//www.gravatar.com/avatar/d920d7080934a66a52a5d2c6c8182376?s=220&r=pg&d=identicon', NULL, NULL, '', '', 0, 0, 0, '2019-10-04 15:34:28', '2019-10-04 15:34:28'),
(54, 'QS5lgDzSVZU9W1UKAAAF', '3user', '3user', '3user@email.com', '$2a$10$lwbtwJjrZUqw09VF5A2GdO.ZW9MAg0ZFn2qe5mlsTfLPiPba0Wi5G', '2019-10-03 14:31:45', NULL, 'images (1).jpg', 23, 'female', 'user3\'s house', 'I live in user3\'s house!!!', 0, 0, 0, '2019-10-04 14:34:46', '2019-10-04 14:34:46');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=338;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `user_infos`
--
ALTER TABLE `user_infos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
