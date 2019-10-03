-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2019 at 08:02 PM
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
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `user` varchar(11) DEFAULT NULL,
  `password` varchar(50) DEFAULT '',
  `access` tinyint(1) NOT NULL DEFAULT '1',
  `accessIds` varchar(250) DEFAULT NULL,
  `users` varchar(250) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `user`, `password`, `access`, `accessIds`, `users`, `createdAt`, `updatedAt`) VALUES
(14, 'Room3', '43', NULL, 1, NULL, NULL, '2019-09-30 19:45:10', '2019-09-30 19:45:10'),
(15, 'room4', '43', NULL, 1, NULL, NULL, '2019-09-30 19:45:59', '2019-09-30 19:45:59'),
(16, 'Room1', '43', NULL, 1, NULL, NULL, '2019-10-01 13:52:07', '2019-10-01 13:52:07'),
(17, 'Room2', '42', NULL, 1, NULL, NULL, '2019-10-01 14:00:01', '2019-10-01 14:00:01'),
(18, 'Room5', '42', 'roomp', 0, NULL, NULL, '2019-10-01 14:17:43', '2019-10-01 14:17:43');

-- --------------------------------------------------------

--
-- Table structure for table `user_infos`
--

DROP TABLE IF EXISTS `user_infos`;
CREATE TABLE IF NOT EXISTS `user_infos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_infos`
--

INSERT INTO `user_infos` (`id`, `socketid`, `username`, `handle`, `email`, `password`, `create_time`, `delete_time`, `image`, `age`, `sex`, `location`, `bio`, `status_active`, `status_participate`, `room_id`, `createdAt`, `updatedAt`) VALUES
(52, 'rHd3uF5lDePn52HqAAAA', '1user', '1user', '1user@email.com', '$2a$10$vV1bt.0A0uOKPMHXqmWs5.ciMIpMxuHRD.Y2ZvlkJxEJk9hzi2b0.', '2019-10-03 04:29:45', NULL, '//www.gravatar.com/avatar/52136435f4a0135ba0f4e8cf78fdd095?s=220&r=pg&d=identicon', NULL, NULL, '', '', 0, 0, 0, '2019-10-03 17:53:25', '2019-10-03 17:53:25'),
(53, 'xqDvlmdxR-Gz5Aa_AAAB', '2user', '2user', '2user@email.com', '$2a$10$kcdoGYjdfGxtMoivn.j3iOmN624FRqE2khJiHdTFnUREv84GqtIZe', '2019-10-03 04:39:36', NULL, '//www.gravatar.com/avatar/d920d7080934a66a52a5d2c6c8182376?s=220&r=pg&d=identicon', NULL, NULL, '', '', 0, 0, 0, '2019-10-03 17:53:20', '2019-10-03 17:53:20'),
(54, 'b0m0BN89p6gsKwjyAAAC', '3user', '3user', '3user@email.com', '$2a$10$lwbtwJjrZUqw09VF5A2GdO.ZW9MAg0ZFn2qe5mlsTfLPiPba0Wi5G', '2019-10-03 14:31:45', NULL, '//www.gravatar.com/avatar/4ffe1708aceffd18c519ebf26af314c2?s=220&r=pg&d=identicon', NULL, NULL, '', '', 0, 0, 0, '2019-10-03 17:53:32', '2019-10-03 17:53:32');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
