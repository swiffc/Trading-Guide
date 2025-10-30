# Main Terraform configuration for Trading Guide infrastructure
terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  backend "s3" {
    bucket         = "trading-guide-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "trading-guide-terraform-locks"
  }
}

# Provider configuration
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "trading-guide"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  availability_zones  = data.aws_availability_zones.available.names
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

# EKS Cluster Module
module "eks" {
  source = "./modules/eks"
  
  environment       = var.environment
  cluster_name      = "${var.project_name}-${var.environment}"
  cluster_version   = var.kubernetes_version
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.private_subnet_ids
  node_desired_size = var.node_desired_size
  node_max_size     = var.node_max_size
  node_min_size     = var.node_min_size
  node_instance_types = var.node_instance_types
}

# RDS Database Module (if needed for future features)
module "rds" {
  source = "./modules/rds"
  count  = var.enable_database ? 1 : 0
  
  environment    = var.environment
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  instance_class = var.db_instance_class
  allocated_storage = var.db_allocated_storage
}

# CloudFront CDN Module
module "cloudfront" {
  source = "./modules/cloudfront"
  
  environment  = var.environment
  domain_name  = var.domain_name
  ssl_cert_arn = var.ssl_certificate_arn
}

# Outputs
output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = module.cloudfront.distribution_domain
}
