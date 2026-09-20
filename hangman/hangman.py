import random

import pygame
from english_words import get_english_words_set

web2lowerset = get_english_words_set(["web2"], lower=True)

pygame.init()

WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Hangman")
clock = pygame.time.Clock()

font_key = pygame.font.Font(None, 32)
font_word = pygame.font.Font(None, 72)
font_message = pygame.font.Font(None, 48)

# --- Word setup (must happen before the main loop) ---
# We pick a random dictionary word and track revealed letters with underscores.
answer = random.choice(list(web2lowerset))
# answer = "rectangle"  # uncomment for testing a fixed word

word_display = ["_" if ch.isalpha() else ch for ch in answer]
letters_guessed = set()
lives = 6
game_state = "game_in_progress"  # game_win | game_lose

# --- Wordle-style keyboard ---
# Each key stores its hit box and color state: unguessed (white), correct (green), wrong (grey).
letters = "abcdefghijklmnopqrstuvwxyz"
COLS = 9
KEY_WIDTH = 64
KEY_HEIGHT = 48
KEY_SPACING = 6
grid_width = COLS * KEY_WIDTH + (COLS - 1) * KEY_SPACING
start_x = (WIDTH - grid_width) // 2
start_y = HEIGHT - 3 * (KEY_HEIGHT + KEY_SPACING) - 24

keyboard = {}
for index, letter in enumerate(letters):
    row = index // COLS
    col = index % COLS
    x = start_x + col * (KEY_WIDTH + KEY_SPACING)
    y = start_y + row * (KEY_HEIGHT + KEY_SPACING)
    keyboard[letter] = {
        "rect": pygame.Rect(x, y, KEY_WIDTH, KEY_HEIGHT),
        "state": "unguessed",
    }

# --- Hangman gallows anchor (left side of screen) ---
GALLOWS_X = 120
GALLOWS_Y = 80
GALLOWS_HEIGHT = 280
ROPE_LENGTH = 40
HANGMAN_COLOR = (220, 220, 220)
GALLOWS_COLOR = (160, 120, 80)


def wrong_guess_count():
    return sum(1 for data in keyboard.values() if data["state"] == "wrong")


def reveal_letter(letter):
    """Fill every matching slot in word_display when the guess is correct."""
    for i, ch in enumerate(answer):
        if ch == letter:
            word_display[i] = letter


def check_win():
    return all(ch != "_" for ch in word_display)


def draw_gallows():
    base_y = GALLOWS_Y + GALLOWS_HEIGHT
    pygame.draw.line(screen, GALLOWS_COLOR, (GALLOWS_X - 60, base_y), (GALLOWS_X + 60, base_y), 6)
    pygame.draw.line(screen, GALLOWS_COLOR, (GALLOWS_X, base_y), (GALLOWS_X, GALLOWS_Y), 6)
    pygame.draw.line(
        screen,
        GALLOWS_COLOR,
        (GALLOWS_X, GALLOWS_Y),
        (GALLOWS_X + 100, GALLOWS_Y),
        6,
    )
    pygame.draw.line(
        screen,
        GALLOWS_COLOR,
        (GALLOWS_X + 100, GALLOWS_Y),
        (GALLOWS_X + 100, GALLOWS_Y + ROPE_LENGTH),
        4,
    )


def draw_hangman(stage):
    """
    Six wrong guesses add parts in order: head, body, left arm, right arm, left leg, right leg.
    `stage` is how many incorrect guesses have been made (0–6).
    """
    cx = GALLOWS_X + 100
    head_y = GALLOWS_Y + ROPE_LENGTH + 22
    body_top = head_y + 22
    body_bottom = body_top + 70

    if stage >= 1:
        pygame.draw.circle(screen, HANGMAN_COLOR, (cx, head_y), 20, 3)
    if stage >= 2:
        pygame.draw.line(screen, HANGMAN_COLOR, (cx, body_top), (cx, body_bottom), 3)
    if stage >= 3:
        pygame.draw.line(screen, HANGMAN_COLOR, (cx, body_top + 15), (cx - 35, body_top + 45), 3)
    if stage >= 4:
        pygame.draw.line(screen, HANGMAN_COLOR, (cx, body_top + 15), (cx + 35, body_top + 45), 3)
    if stage >= 5:
        pygame.draw.line(screen, HANGMAN_COLOR, (cx, body_bottom), (cx - 30, body_bottom + 55), 3)
    if stage >= 6:
        pygame.draw.line(screen, HANGMAN_COLOR, (cx, body_bottom), (cx + 30, body_bottom + 55), 3)


def key_colors(state):
    if state == "correct":
        return (106, 170, 100), (255, 255, 255)
    if state == "wrong":
        return (120, 124, 126), (255, 255, 255)
    return (255, 255, 255), (30, 30, 30)


def draw_word():
    """Large letters/underscores with gaps; spaces in the answer stay as gaps."""
    parts = []
    for ch in word_display:
        parts.append(ch.upper() if ch != " " else " ")
    line = "  ".join(parts)
    surface = font_word.render(line, True, (255, 255, 255))
    rect = surface.get_rect(center=(WIDTH // 2 + 80, 200))
    screen.blit(surface, rect)


def draw_keyboard():
    for letter, data in keyboard.items():
        bg, fg = key_colors(data["state"])
        pygame.draw.rect(screen, bg, data["rect"], border_radius=6)
        pygame.draw.rect(screen, (80, 80, 80), data["rect"], width=1, border_radius=6)
        label = font_key.render(letter.upper(), True, fg)
        label_rect = label.get_rect(center=data["rect"].center)
        screen.blit(label, label_rect)


def draw_hud():
    lives_surface = font_key.render(f"Lives: {lives}", True, (200, 200, 200))
    screen.blit(lives_surface, (WIDTH - 140, 24))


def draw_end_message():
    if game_state == "game_win":
        msg = "You win!"
        color = (106, 170, 100)
    elif game_state == "game_lose":
        msg = f"You lose — {answer.upper()}"
        color = (200, 80, 80)
    else:
        return
    surface = font_message.render(msg, True, color)
    rect = surface.get_rect(center=(WIDTH // 2 + 80, 320))
    screen.blit(surface, rect)


def handle_letter_click(letter):
    global lives, game_state

    if game_state != "game_in_progress":
        return
    data = keyboard[letter]
    if data["state"] != "unguessed":
        return

    letters_guessed.add(letter)

    if letter in answer:
        data["state"] = "correct"
        reveal_letter(letter)
        if check_win():
            game_state = "game_win"
    else:
        data["state"] = "wrong"
        lives -= 1
        if lives <= 0 or wrong_guess_count() >= 6:
            game_state = "game_lose"


running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            pos = pygame.mouse.get_pos()
            for letter, data in keyboard.items():
                if data["rect"].collidepoint(pos):
                    handle_letter_click(letter)
                    break

    screen.fill((30, 30, 30))
    draw_gallows()
    draw_hangman(wrong_guess_count())
    draw_word()
    draw_hud()
    draw_keyboard()
    draw_end_message()
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
