# Defining classes and functions as described in previous steps
class Tile:
    def __init__(self, is_walkable):
        self.is_walkable = is_walkable
        self.entity = None  # Can be 'P', 'M', or 'G', or None if the tile is empty

class Entity:
    def __init__(self, x, y, symbol):
        self.x = x
        self.y = y
        self.symbol = symbol

class Player(Entity):
    def __init__(self, x, y):
        super().__init__(x, y, 'P')
        self.hp = 100
        self.damage = 10
        self.exp = 0
        self.level = 1

class Gold(Entity):
    def __init__(self, x, y):
        super().__init__(x, y, 'G')
        self.hp = 0  # Gold doesn't need health points
        self.alive = True  # Gold is considered "alive" until it's collected

class Monster(Entity):
    def __init__(self, x, y):
        super().__init__(x, y, 'M')
        self.hp = 50
        self.damage = 5
        self.gold_drop = 10
        self.alive = True  # We need to add this line

class Gold(Entity):
    def __init__(self, x, y):
        super().__init__(x, y, 'G')

def place_entity_on_map(game_map, entity):
    game_map[entity.y][entity.x].entity = entity.symbol

def remove_entity_from_map(game_map, entity):
    game_map[entity.y][entity.x].entity = None

def draw_map(game_map):
    for row in game_map:
        for tile in row:
            if tile.entity is not None:
                print(tile.entity, end='')
            elif tile.is_walkable:
                print('.', end='')
            else:
                print('#', end='')  # Represent non-walkable tiles as '#'
        print()

def game_loop(game_map, player, monsters):
    while True:
        # Draw the game state
        draw_map(game_map)

        # Get player input
        command = input("> ")

        # Remove player from current position
        remove_entity_from_map(game_map, player)

        # Determine action
        if command == "w":  # Move up
            if game_map[player.y - 1][player.x].is_walkable:
                player.y -= 1
        elif command == "a":  # Move left
            if game_map[player.y][player.x - 1].is_walkable:
                player.x -= 1
        elif command == "s":  # Move down
            if game_map[player.y + 1][player.x].is_walkable:
                player.y += 1
        elif command == "d":  # Move right
            if game_map[player.y][player.x + 1].is_walkable:
                player.x += 1

        # Place player in new position
        place_entity_on_map(game_map, player)

        # Check for monsters in new position
        for monster in monsters:
            if monster.x == player.x and monster.y == player.y and monster.alive:
                command = input("There's a monster here! Type 'attack' to attack: ")
                if command == "attack":
                    monster.hp -= player.damage
                    if monster.hp <= 0:
                        monster.alive = False  # Monster is killed
                        remove_entity_from_map(game_map, monster)  # Remove the monster from the game
                        player.exp += monster.gold_drop  # Gain exp from killing the monster
                        print(f"You've defeated the monster and earned {monster.gold_drop} gold!")
                        if player.exp >= 100:  # Level up mechanism
                            player.exp -= 100
                            player.level += 1
                            player.hp += 20  # Increase HP on level up
                            player.damage += 5  # Increase damage on level up
                            print("Congratulations, you leveled up! You're now level " + str(player.level))

        # Check if player is dead
        if player.hp <= 0:
            print("Game over!")
            break

        print(f"Player HP: {player.hp}, Player level: {player.level}, Player EXP: {player.exp}")


# Initialize game
width, height = 10, 10  # Set your game map size

# Create game map
game_map = [[Tile(True) for _ in range(width)] for _ in range(height)]

# Create player
player = Player(width // 2, height // 2)

# Create monsters
monsters = [Monster(1, 1), Monster(width - 2, height - 2)]

# Place entities on map
place_entity_on_map(game_map, player)
for monster in monsters:
    place_entity_on_map(game_map, monster)

# Start game loop
game_loop(game_map, player, monsters)
