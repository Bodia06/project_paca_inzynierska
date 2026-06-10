#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0;3m'
BOLD='\033[1m'

echo -e "${BOLD}${YELLOW}=== Docker Management Script for HelpToStart ===${NC}"
echo "1) Start project (docker-compose up)"
echo "2) Rebuild and start (docker-compose up --build)"
echo "3) Start in background mode (detached -d)"
echo "4) Stop containers (docker-compose down)"
echo "5) Full cleanup (stop containers and remove dangling images/volumes)"
echo "6) Exit"
echo -n "Choose an option (1-6): "
read choice

case $choice in
    1)
        echo -e "\n${GREEN}[Docker]: Starting containers...${NC}"
        docker-compose up -d
        echo -e "${YELLOW}[Sequelize]: Checking and preparing the database...${NC}"
        sleep 3 
        docker-compose exec backend npx sequelize-cli db:create 2>/dev/null || echo "Database already exists."
        docker-compose exec backend npx sequelize-cli db:migrate
        docker-compose exec backend npx sequelize-cli db:seed:all
        echo -e "${GREEN}[Sequelize]: Database setup and seeding completed!${NC}"
        docker-compose up
        ;;
    2)
        echo -e "\n${GREEN}[Docker]: Rebuilding and starting containers...${NC}"
        docker-compose up --build -d
        echo -e "${YELLOW}[Sequelize]: Checking and preparing the database...${NC}"
        sleep 5
        docker-compose exec backend npx sequelize-cli db:create 2>/dev/null || echo "Database already exists."
        docker-compose exec backend npx sequelize-cli db:migrate
        docker-compose exec backend npx sequelize-cli db:seed:all
        echo -e "${GREEN}[Sequelize]: Database setup and seeding completed!${NC}"
        docker-compose up
        ;;
    3)
        echo -e "\n${GREEN}[Docker]: Starting in background mode...${NC}"
        docker-compose up -d
        echo -e "${GREEN}Project started in the background! You can view backend logs using: docker-compose logs -f backend${NC}"
        ;;
    4)
        echo -e "\n${YELLOW}[Docker]: Stopping containers...${NC}"
        docker-compose down
        echo -e "${GREEN}Containers successfully stopped.${NC}"
        ;;
    5)
        echo -e "\n${RED}[Docker]: Performing full system cleanup...${NC}"
        docker-compose down --volumes --remove-orphans
        docker system prune -f
        echo -e "${GREEN}Cleanup completed. Build cache, networks, and volumes have been reset.${NC}"
        ;;
    6)
        echo -e "\nExiting."
        exit 0
        ;;
    *)
        echo -e "\n${RED}Invalid choice. Please try again.${NC}"
        ;;
esac