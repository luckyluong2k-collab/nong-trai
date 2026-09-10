extends Node2D

const SIZE := Vector2(960, 540)
const TILE := 32
const FARM := Vector2(80, 230)
const COLS := 10
const ROWS := 6
const POND := Rect2(650, 170, 230, 230)
const HOUSE := Rect2(45, 55, 220, 125)
const BIN := Rect2(285, 135, 42, 45)

enum Tool { HOE, SEED, WATER, ROD }

var player := Vector2(430, 350)
var facing := Vector2.DOWN
var tool := Tool.HOE
var plots := {}
var day := 1
var coins := 100
var seeds := 12
var crops := 0
var fish := 0
var energy := 100
var note := "ENTER để bắt đầu"
var note_time := 999.0
var started := false
var rng := RandomNumberGenerator.new()

func _ready() -> void:
	rng.randomize()
	for y in range(ROWS):
		for x in range(COLS):
			plots[Vector2i(x, y)] = {"soil": false, "seed": false, "water": false, "grow": 0}
	queue_redraw()

func _process(delta: float) -> void:
	if started:
		move_player(delta)
	if note_time > 0:
		note_time -= delta
	queue_redraw()

func move_player(delta: float) -> void:
	var v := Vector2.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT): v.x -= 1
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT): v.x += 1
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP): v.y -= 1
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN): v.y += 1
	if v == Vector2.ZERO: return
	v = v.normalized()
	facing = Vector2(sign(v.x), 0) if abs(v.x) > abs(v.y) else Vector2(0, sign(v.y))
	var next := player + v * 155.0 * delta
	next.x = clamp(next.x, 18.0, SIZE.x - 18.0)
	next.y = clamp(next.y, 75.0, SIZE.y - 22.0)
	if not POND.grow(-4).has_point(next) and not HOUSE.grow(-5).has_point(next):
		player = next

func _unhandled_input(event: InputEvent) -> void:
	if not (event is InputEventKey) or not event.pressed or event.echo: return
	var key := (event as InputEventKey).keycode
	if not started:
		if key == KEY_ENTER or key == KEY_SPACE:
			started = true
			tell("Chào mừng về Nông Trại Đức Lương!")
		return
	match key:
		KEY_1: tool = Tool.HOE; tell("Đã chọn Cuốc")
		KEY_2: tool = Tool.SEED; tell("Đã chọn Hạt giống")
		KEY_3: tool = Tool.WATER; tell("Đã chọn Bình tưới")
		KEY_4: tool = Tool.ROD; tell("Đã chọn Cần câu")
		KEY_SPACE: use_tool()
		KEY_E: interact()
		KEY_N: next_day()
		KEY_F5: save_game()
		KEY_F9: load_game()

func use_tool() -> void:
	if tool == Tool.ROD:
		go_fishing()
		return
	var cell := farm_cell(player + facing * 34.0)
	if cell == Vector2i(-1, -1):
		tell("Hãy đứng sát một ô ruộng")
		return
	var p: Dictionary = plots[cell]
	if p.seed and p.grow >= 3:
		crops += 1
		p.seed = false; p.water = false; p.grow = 0
		plots[cell] = p
		tell("Thu hoạch được 1 nông sản")
		return
	match tool:
		Tool.HOE:
			if use_energy(3): p.soil = true; plots[cell] = p; tell("Đã cuốc đất")
		Tool.SEED:
			if not p.soil: tell("Cần cuốc đất trước")
			elif p.seed: tell("Ô này đã có cây")
			elif seeds <= 0: tell("Hết hạt giống")
			elif use_energy(1): seeds -= 1; p.seed = true; plots[cell] = p; tell("Đã gieo hạt")
		Tool.WATER:
			if not p.seed: tell("Chưa có cây để tưới")
			elif use_energy(2): p.water = true; plots[cell] = p; tell("Đã tưới cây")

func go_fishing() -> void:
	if not POND.grow(45).has_point(player):
		tell("Hãy đứng sát bờ ao")
		return
	if not use_energy(4): return
	if rng.randf() < 0.68:
		fish += 1
		var names := ["cá rô", "cá chép", "cá trắm", "cá lóc"]
		tell("Bắt được %s!" % names[rng.randi_range(0, names.size() - 1)])
	else:
		tell("Cá vừa thoát mất")

func interact() -> void:
	if player.distance_to(BIN.get_center()) < 65:
		var earned := crops * 45 + fish * 70
		if earned == 0: tell("Thùng bán hàng đang trống"); return
		coins += earned; crops = 0; fish = 0
		tell("Đã bán hàng, nhận %d xu" % earned)
	elif player.distance_to(Vector2(430, 150)) < 65:
		if coins >= 25: coins -= 25; seeds += 5; tell("Mua 5 hạt giống từ Bác Tư")
		else: tell("Cần 25 xu để mua hạt giống")
	elif player.distance_to(Vector2(158, 185)) < 70:
		next_day()
	else:
		tell("Không có gì để tương tác")

func next_day() -> void:
	day += 1; energy = 100
	for cell in plots:
		var p: Dictionary = plots[cell]
		if p.seed and p.water: p.grow = min(p.grow + 1, 3)
		p.water = false
		plots[cell] = p
	tell("Ngày mới bắt đầu; cây đã lớn thêm")

func use_energy(value: int) -> bool:
	if energy < value: tell("Hết năng lượng, hãy ngủ"); return false
	energy -= value
	return true

func farm_cell(point: Vector2) -> Vector2i:
	var local := point - FARM
	if local.x < 0 or local.y < 0: return Vector2i(-1, -1)
	var cell := Vector2i(int(local.x / TILE), int(local.y / TILE))
	return cell if cell.x < COLS and cell.y < ROWS else Vector2i(-1, -1)

func tell(text: String) -> void:
	note = text; note_time = 2.0

func save_game() -> void:
	var list := []
	for c in plots:
		var p: Dictionary = plots[c]
		list.append({"x": c.x, "y": c.y, "soil": p.soil, "seed": p.seed, "water": p.water, "grow": p.grow})
	var data := {"day": day, "coins": coins, "seeds": seeds, "crops": crops, "fish": fish, "energy": energy, "px": player.x, "py": player.y, "plots": list}
	var file := FileAccess.open("user://save.json", FileAccess.WRITE)
	if file: file.store_string(JSON.stringify(data)); tell("Đã lưu game")

func load_game() -> void:
	if not FileAccess.file_exists("user://save.json"): tell("Chưa có bản lưu"); return
	var data = JSON.parse_string(FileAccess.get_file_as_string("user://save.json"))
	if typeof(data) != TYPE_DICTIONARY: tell("Bản lưu bị lỗi"); return
	day = data.get("day", 1); coins = data.get("coins", 100); seeds = data.get("seeds", 12)
	crops = data.get("crops", 0); fish = data.get("fish", 0); energy = data.get("energy", 100)
	player = Vector2(data.get("px", 430), data.get("py", 350))
	for item in data.get("plots", []):
		var c := Vector2i(item.x, item.y)
		if plots.has(c): plots[c] = {"soil": item.soil, "seed": item.seed, "water": item.water, "grow": item.grow}
	tell("Đã tải game")

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, SIZE), Color("#7cc36a"))
	draw_rect(Rect2(0, 185, 620, 38), Color("#d8b878"))
	draw_rect(Rect2(360, 185, 38, 355), Color("#d8b878"))
	draw_house()
	draw_rect(BIN, Color("#754531")); text(Vector2(283, 127), "BÁN", 13)
	draw_rect(Rect2(FARM - Vector2(8, 8), Vector2(COLS * TILE + 16, ROWS * TILE + 16)), Color("#5f8246"))
	for c in plots: draw_plot(c, plots[c])
	draw_rect(POND.grow(7), Color("#557c54")); draw_rect(POND, Color("#4ba5c4"))
	for y in range(195, 390, 32): draw_rect(Rect2(675, y, 180, 3), Color("#82d1e3"))
	draw_npc(Vector2(430, 150)); text(Vector2(405, 115), "Bác Tư", 13, Color("#322b25"))
	draw_player(player)
	draw_hud()
	if not started: draw_title()
	elif note_time > 0: draw_note()

func draw_house() -> void:
	draw_rect(HOUSE, Color("#efd39a"))
	draw_colored_polygon(PackedVector2Array([Vector2(32, 65), Vector2(155, 20), Vector2(280, 65)]), Color("#b64c43"))
	draw_rect(Rect2(132, 115, 52, 65), Color("#815239"))
	draw_rect(Rect2(66, 82, 45, 38), Color("#79aac7")); draw_rect(Rect2(205, 82, 45, 38), Color("#79aac7"))

func draw_plot(c: Vector2i, p: Dictionary) -> void:
	var pos := FARM + Vector2(c.x * TILE, c.y * TILE)
	var col := Color("#976b3d") if p.soil else Color("#77ad54")
	if p.water: col = Color("#625043")
	draw_rect(Rect2(pos + Vector2.ONE, Vector2(TILE - 2, TILE - 2)), col)
	if not p.seed: return
	var center := pos + Vector2(16, 19)
	if p.grow == 0: draw_rect(Rect2(center - Vector2(3, 2), Vector2(6, 4)), Color("#e7c45d"))
	else:
		draw_rect(Rect2(center - Vector2(2, 12), Vector2(4, 15)), Color("#356f3e"))
		draw_circle(center + Vector2(-6, -5), 4 + p.grow, Color("#57a850"))
		draw_circle(center + Vector2(6, -5), 4 + p.grow, Color("#57a850"))
		if p.grow >= 3: draw_circle(center + Vector2(0, -11), 6, Color("#efc94d"))

func draw_player(pos: Vector2) -> void:
	draw_circle(pos + Vector2(0, 16), 12, Color(0, 0, 0, .2))
	draw_rect(Rect2(pos + Vector2(-9, -4), Vector2(18, 19)), Color("#2875b7"))
	draw_rect(Rect2(pos + Vector2(-7, -19), Vector2(14, 15)), Color("#d89d70"))
	draw_rect(Rect2(pos + Vector2(-8, -21), Vector2(16, 6)), Color("#403028"))
	draw_rect(Rect2(pos + Vector2(-7, 15), Vector2(5, 8)), Color("#343744")); draw_rect(Rect2(pos + Vector2(2, 15), Vector2(5, 8)), Color("#343744"))

func draw_npc(pos: Vector2) -> void:
	draw_rect(Rect2(pos + Vector2(-9, -4), Vector2(18, 19)), Color("#704fa2"))
	draw_rect(Rect2(pos + Vector2(-7, -19), Vector2(14, 15)), Color("#d7a474"))
	draw_rect(Rect2(pos + Vector2(-8, -21), Vector2(16, 6)), Color("#d2cdc0"))

func draw_hud() -> void:
	draw_rect(Rect2(0, 0, 960, 64), Color("#263740"))
	text(Vector2(16, 27), "Ngày %d   Xu %d   Hạt %d   Nông sản %d   Cá %d" % [day, coins, seeds, crops, fish], 17, Color.WHITE)
	text(Vector2(700, 27), "Năng lượng %d/100" % energy, 16, Color("#f5d267"))
	var names := ["1 Cuốc", "2 Hạt", "3 Tưới", "4 Câu"]
	for i in range(4):
		var r := Rect2(310 + i * 90, 480, 82, 42)
		draw_rect(r, Color("#f0ddb0")); draw_rect(r, Color("#4c392d") if i == tool else Color("#92734f"), false, 3)
		text(r.position + Vector2(8, 27), names[i], 14, Color("#322a24"))
	text(Vector2(12, 535), "WASD: đi | SPACE: dùng đồ | E: tương tác/bán | N: ngủ | F5/F9: lưu/tải", 13, Color("#263238"))

func draw_note() -> void:
	draw_rect(Rect2(205, 415, 550, 50), Color(0.05, 0.06, 0.08, .88)); draw_rect(Rect2(205, 415, 550, 50), Color("#f0d589"), false, 2)
	text(Vector2(220, 447), note, 17, Color.WHITE)

func draw_title() -> void:
	draw_rect(Rect2(Vector2.ZERO, SIZE), Color(0, 0, 0, .65))
	draw_rect(Rect2(180, 105, 600, 320), Color("#f2dfaf")); draw_rect(Rect2(180, 105, 600, 320), Color("#513b2c"), false, 5)
	text(Vector2(220, 180), "NÔNG TRẠI ĐỨC LƯƠNG", 34, Color("#396744"), 520, HORIZONTAL_ALIGNMENT_CENTER)
	text(Vector2(240, 225), "Trồng cây • Câu cá • Bán hàng • Mở rộng nông trại", 18, Color("#604a37"), 480, HORIZONTAL_ALIGNMENT_CENTER)
	text(Vector2(275, 285), "Cuốc → Gieo → Tưới → Nhấn N để sang ngày", 17, Color("#3d352e"))
	text(Vector2(275, 325), "Đứng sát bờ ao và dùng Cần câu", 17, Color("#3d352e"))
	draw_rect(Rect2(330, 360, 300, 42), Color("#4f8a55")); text(Vector2(330, 389), "NHẤN ENTER ĐỂ CHƠI", 18, Color.WHITE, 300, HORIZONTAL_ALIGNMENT_CENTER)

func text(pos: Vector2, value: String, size: int, color: Color = Color.WHITE, width: float = -1, align = HORIZONTAL_ALIGNMENT_LEFT) -> void:
	draw_string(ThemeDB.fallback_font, pos, value, align, width, size, color)
