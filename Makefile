.DEFAULT_GOAL := help
DOCKER_RUNNING := $(shell docker info > /dev/null 2>&1 && echo true || echo false)

# ---------------------------------------------------------------------------- #
# Check if docker is running (utility function)
check_docker_status: check_env
	@if [ "$(DOCKER_RUNNING)" != "true" ]; then exit 1; fi

check_env:
	@if [ ! -f .env ]; then \
		echo ".env file is missing."; \
		exit 1; \
	fi
	@bash ./utils/check_env.sh

help: check_docker_status
	@if [ "$(CHECK_ENV)" ]; then exit 1; fi
	@echo "Usage: make [target]"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

up: dev # Start the containers in development mode

dev: check_docker_status ## Start the containers in development mode
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@read -p "Do you want to seed the database? (y/n) " answer; \
	if [ "$$answer" = "y" ]; then \
		$(MAKE) seed; \
	else \
		echo "Skipping seed."; \
	fi
	

prod: check_docker_status ## Start the containers in production mode
	docker compose up -d --build --remove-orphans --force-recreate

down: check_docker_status ## Stop the containers
	docker compose down

reup: check_docker_status down up ## Restart the containers

status: check_docker_status ## Check the status of the containers
	@docker compose ps

pretty: check_docker_status ## Execute `yarn run format` in the frontend container
	-@docker compose exec frontend yarn run format
	-@docker compose exec backend yarn run format

# ---------------------------------------------------------------------------- #
db: check_docker_status ## Open database shell
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres

psql: check_docker_status ## Open postgresql shell
	docker compose exec postgres psql -U postgres -d postgres

prisma: check_docker_status ## Open prisma studio
	docker compose exec backend npx prisma studio --port 5555 --browser none

seed: check_docker_status ## Run prisma migration
	docker compose exec backend npx prisma db seed

migrate: check_docker_status
	docker compose exec backend npx prisma migrate dev

# ---------------------------------------------------------------------------- #
shell-%: check_docker_status ## Open a bash shell in the container
	@docker compose exec $* sh

# ----------------------------------------------------------------------------
logs: ## Shows logs lively in the container
	@docker compose logs --follow --tail 100

logs-%: check_docker_status ## Shows logs lively in the selected container
	@while true; do docker compose logs --tail 100 --follow $*; sleep 1; done

# ---------------------------------------------------------------------------- #
rm_images: check_docker_status ## Remove all images
	@docker compose down --rmi local
	@echo "All images removed."

clean: check_docker_status ## Stop the containers and remove the volumes
	-@docker compose rm -svf

fclean: check_docker_status clean	## Stop the containers and remove the volumes and images
	-@docker compose down --rmi local --volumes
	-@docker rmi -f $(docker compose images -q)

.PHONY: up down reup rm_images psql prisma seed shell-% logs logs-% check_docker_status check_env help clean fclean
