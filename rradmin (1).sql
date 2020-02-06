-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 21, 2019 at 12:02 PM
-- Server version: 5.7.21
-- PHP Version: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rradmin`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `alternate_email` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `alternate_mobile` varchar(255) DEFAULT NULL,
  `address` text,
  `status` enum('active','inactive') DEFAULT NULL,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `username`, `password`, `name`, `email`, `alternate_email`, `mobile`, `alternate_mobile`, `address`, `status`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'nilmoni', '$2a$10$nfqASHMiK9xOICFykQETe...7MdJzEtw38I/d6tRTgKkD4iefp8Q.', 'Nilmoni Patra', 'nilmoni@gmail.com', 'alternilmoni@gmail.com', '9547933888', '7908292825', 'Ashoknagar,Midnapore,721101', 'active', NULL, NULL, NULL, NULL),
(6, 'tanbir ', '$2a$10$iJ8UYSlyH.xqwwoy3mgd6OuZOT7nll04k96HZiyjR8MAHTtHpsDb.', 'Tanbir Hossain', 'tanbir@gmail.com', 'tanbir@gmail.com', '9933778844', '9547812541', 'Midnapore', 'active', NULL, NULL, '2019-10-16 10:19:04', '2019-10-16 10:19:04');

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
CREATE TABLE IF NOT EXISTS `candidates` (
  `candidate_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `nationality` datetime DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT NULL,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`candidate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`candidate_id`, `username`, `password`, `first_name`, `middle_name`, `last_name`, `email`, `mobile`, `gender`, `dob`, `nationality`, `status`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, NULL, '$2a$10$tSen2zl2Olpq2Ma8xxfbpekg9T0i2e1RmRAbf7yoFfiqkoKDDffEe', 'Nilmoni', NULL, 'Patra', 'nilmoni@gmail.com', '9547933888', NULL, NULL, NULL, NULL, NULL, NULL, '2019-10-21 11:19:43', '2019-10-21 11:19:43'),
(2, NULL, '$2a$10$XhFRyiRTj7Q2ya2RY7tam.xVnRfpzBaNsN.CsjhNuXx1BCCXWIQii', 'Nilmoni', NULL, 'Patra', 'nilmoni@gmail.com', '9547933888', NULL, NULL, NULL, NULL, NULL, NULL, '2019-10-21 11:58:05', '2019-10-21 11:58:05');

-- --------------------------------------------------------

--
-- Table structure for table `job_seekers`
--

DROP TABLE IF EXISTS `job_seekers`;
CREATE TABLE IF NOT EXISTS `job_seekers` (
  `job_seeker_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `last_login_at` date DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT NULL,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`job_seeker_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `job_seekers`
--

INSERT INTO `job_seekers` (`job_seeker_id`, `username`, `password`, `last_login_at`, `status`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'sasdasdas', '$2a$10$QteGG85wM1MP6krH2de6o.mJIFRTgiGpzcsJet8up5IRXCfEX58ZO', '2019-10-16', 'inactive', NULL, NULL, '2019-10-16 10:59:34', '2019-10-16 11:02:23'),
(14, 'cdsdasdasd', '$2a$10$tL5E83NjtATx89WTRR/FD.EZyiZdNfp7GuD1pViMi0YCGO6m14L1i', '2019-10-16', 'active', NULL, NULL, '2019-10-16 11:53:43', '2019-10-16 11:53:43');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
