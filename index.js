// import _ from lodash

class Block
{
	constructor(type, count)
	{
		this.type = type
		this.count = count
		if (!this.count)
			this.count = 0 // explocit number type
	}

	GetBlock()
	{
		switch (this.type)
		{
			case 1:
				return [
					[
						[true, true],
						[true, true],
					],
				]
			case 2:
				return [[[true], [true], [true], [true]], [[true, true, true, true]]]
			case 3:
				return [
					[
						[true, true, false],
						[false, true, true],
					],
					[
						[false, true],
						[true, true],
						[true, false],
					],
				]
			case 4:
				return [
					[
						[false, true, true],
						[true, true, false],
					],
					[
						[true, false],
						[true, true],
						[false, true],
					],
				]
			case 5:
				return [
					[
						[false, true],
						[false, true],
						[true, true],
					],
					[
						[true, false, false],
						[true, true, true],
					],
					[
						[true, true],
						[true, false],
						[true, false],
					],
					[
						[true, true, true],
						[false, false, true],
					],
				]
			case 6:
				return [
					[
						[true, false],
						[true, false],
						[true, true],
					],
					[
						[true, true, true],
						[true, false, false],
					],
					[
						[true, true],
						[false, true],
						[false, true],
					],
					[
						[false, false, true],
						[true, true, true],
					],
				]
			case 7:
				return [
					[
						[true, true, true],
						[false, true, false],
					],
					[
						[false, true],
						[true, true],
						[false, true],
					],
					[
						[false, true, false],
						[true, true, true],
					],
					[
						[true, false],
						[true, true],
						[true, false],
					],
				]
			case 8:
				return [
					[
						[false, true, false],
						[true, true, true],
						[false, true, false],
					],
				]
			case 9:
				return [[[true]]]
		}

		console.log("정보가 없는 블럭이 들어왔다.. type: " + this.type)
		return null
	}

	GetValidArray(board, y, x)
	{
		var blocks = this.GetBlock()

		var result = []
		blocks.forEach((block) =>
		{
			// 크기 맞는지 체크
			var h = board.length
			var w = board[0].length
			var leftHeight = h - y
			var leftWidth = w - x
			var blockHeight = block.length
			var blockWidth = block[0].length
			if (blockHeight > leftHeight || blockWidth > leftWidth)
			{
				result.push(false)
				return
			}

			// 블록 겹침 체크
			var isInvalid = false
			for (var i = 0; i < blockHeight && !isInvalid; ++i)
			{
				for (var j = 0; j < blockWidth; ++j)
				{
					if (!block[i][j]) continue

					if (board[i + y][j + x] != 0)
					{
						isInvalid = true
						break
					}
				}
			}

			result.push(!isInvalid)
		})
		return result
	}

	Apply(board, y, x, index)
	{
		var block = this.GetBlock()[index]

		var blockHeight = block.length
		var blockWidth = block[0].length
		for (var i = 0; i < blockHeight; ++i)
		{
			for (var j = 0; j < blockWidth; ++j)
			{
				if (!block[i][j]) continue

				if (board[y + i][x + j] != 0) console.log("버그 발생!!")
				board[y + i][x + j] = this.type
			}
		}
	}

	Use()
	{
		this.count--
	}
}

var g_canvas_w
var g_canvas_h

var g_tile_data = {}
var g_solution = []
var g_is_solution_view = false

var g_block_instance_list = [
	new Block(0, -1), // Dummy for dev-friendly code style
	new Block(1, 0),
	new Block(2, 0),
	new Block(3, 0),
	new Block(4, 0),
	new Block(5, 0),
	new Block(6, 0),
	new Block(7, 0),
	new Block(8, 0),
	new Block(9, 0)
]

window.onload = function ()
{
	window.onresize = RenderTile

	input_canvas_w.onchange = () => ResizeCanvas()
	input_canvas_h.onchange = () => ResizeCanvas()

	button_run.onclick = GetSolution

	// 시작하면 기본값으로 타일 한번 생성
	ResizeCanvas()
}

function ResizeCanvas()
{
	if (input_canvas_w.value <= 0 || input_canvas_h.value <= 0)
		return

	g_canvas_w = input_canvas_w.value
	g_canvas_h = input_canvas_h.value

	g_tile_data = {}
	for (var i = 0; i < g_canvas_h; ++i)
		for (var j = 0; j < g_canvas_w; ++j)
			g_tile_data[[i, j]] = 'none'

	RenderTile()
}

function RenderTile()
{
	remove_childs(tile_background)
	remove_childs(tile_block)

	var rt = right_container.getBoundingClientRect()
	var canvas_width = rt.width - 100
	var canvas_height = rt.height - 100
	var tile_width = clamp(canvas_width / g_canvas_w, 10, 500)
	var tile_height = clamp(canvas_height / g_canvas_h, 10, 500)
	var tile_size = Math.min(tile_width, tile_height)
	var canvas_left = rt.left + 50
	var canvas_top = rt.top + 50

	// Make Background Tiles
	var tile_start_y = canvas_height / 2 + canvas_top - tile_size * g_canvas_h / 2
	var tile_start_x = canvas_width / 2 + canvas_left - tile_size * g_canvas_w / 2
	for (var i = 0; i < g_canvas_h; ++i)
	{
		for (var j = 0; j < g_canvas_w; ++j)
		{
			var div = document.createElement('div')
			div.classList.add('hover_opacity')
			div.classList.add('free_position')
			div.classList.add('tile_img')
			div.classList.add('background_tile')
			div.toggleAttribute('tile_blocked', g_tile_data[[i, j]] == 'block')
			div.style.top = (tile_start_y + tile_size * i) + 'px'
			div.style.left = (tile_start_x + tile_size * j) + 'px'
			div.style.width = tile_size + 'px'
			div.style.height = tile_size + 'px'
			div.setAttribute('y', i)
			div.setAttribute('x', j)
			div.onclick = OnClickBackgroundTile
			tile_background.appendChild(div)
		}
	}

	// Render Solution
	if (HasSolution())
	{
		g_solution['solution'].forEach(e =>
		{
			var y = e[0]
			var x = e[1]
			var type = e[2]
			var rotate = e[3]

			var div = document.createElement('div')
			div.classList.add('free_position')
			div.classList.add('tile_img')
			div.style.top = (tile_start_y + tile_size * y) + 'px'
			div.style.left = (tile_start_x + tile_size * x) + 'px'

			var block_matrix = g_block_instance_list[type].GetBlock()[rotate]
			var block_matrix_h = block_matrix.length
			var block_matrix_w = block_matrix[0].length
			div.style.width = tile_size * block_matrix_w + 'px'
			div.style.height = tile_size * block_matrix_h + 'px'
			div.style.backgroundImage = 'url(static/' + type + '_' + rotate + '.png)'
			tile_block.appendChild(div)
		})
	}
	mouse_blocker.style.display = HasSolution() ? 'block' : 'none'
	mouse_blocker.style.left = rt.left + 'px'
	mouse_blocker.style.top = rt.top + 'px'
	mouse_blocker.style.width = rt.width + 'px'
	mouse_blocker.style.height = rt.height + 'px'

	button_run.firstChild.nodeValue = HasSolution() ? '돌아가기' : '계산하기'
}

function HasSolution()
{
	return ('solution' in g_solution && g_solution['solution'].length > 0)
}

function OnClickBackgroundTile()
{
	if (g_is_solution_view)
		return

	var element = event.currentTarget
	var y = element.getAttribute('y')
	var x = element.getAttribute('x')
	element.toggleAttribute('tile_blocked')
	g_tile_data[[y, x]] = element.hasAttribute('tile_blocked') ? 'block' : 'none'
}

function GetSolution()
{
	if (HasSolution())
	{
		g_solution = {}
		RenderTile()
		return
	}

	var board = InitBoard(g_canvas_h, g_canvas_w)
	Object.keys(g_tile_data).forEach(e =>
	{
		if (g_tile_data[e] == 'block')
		{
			var arg = e.split(',').map(e => parseInt(e))
			board[arg[0]][arg[1]] = -1
		}
	})

	var blocks = [
		new Block(1, block_amount_1.value),
		new Block(2, block_amount_2.value),
		new Block(3, block_amount_3.value),
		new Block(4, block_amount_4.value),
		new Block(5, block_amount_5.value),
		new Block(6, block_amount_6.value),
		new Block(7, block_amount_7.value),
		new Block(8, block_amount_8.value),
		new Block(9, block_amount_9.value),
	]
	console.log(blocks)
	var footprint = []

	console.log("Finding...")
	g_solution = []
	Solve(board, blocks, footprint)
	console.log("Done.")

	if (!HasSolution())
	{
		alert('가능한 조합이 없습니다.')
		return
	}

	RenderTile()
}

function Solve(board, blocks, footprint, y = 0, x = 0)
{
	var h = board.length
	var w = board[0].length
	var nextPos = GetNextPos(h, w, y, x)
	// console.log('nextPos:', nextPos, 'y:', y, 'x:', x, 'board:', board, 'footprint:', footprint, 'blocks:', blocks)

	// Check there is empty line when here is start of new line
	if (x == 0 && y != 0)
	{
		for (var i = 0; i < w; ++i)
		{
			if (board[y - 1][i] == 0)
				return false
		}
	}

	if (IsFullBoard(board))
	{
		console.log("Found. ^^ Let me show")
		DebugBoard(board)
		DebugFootprint(footprint)
		g_solution = { 'board': board, 'solution': footprint }
		return true
	}

	blocks = blocks.filter((e) => e.count > 0)
	blocks.sort((a, b) => b.count - a.count)
	if (checkbox_keep_block9.checked) // 9를 후순위로
	{
		var block9 = blocks.filter(e => e.type == 9)[0]
		blocks = blocks.filter(e => e.type != 9)
		blocks = blocks.concat(block9)
	}

	// 아래 코드는 forEach가 순서를 보장하지 않는 버그가 있는건지 이상하게 작동한다.
	// blocks.forEach((block) =>
	// {
	// 	validArray = block.GetValidArray(board, y, x)

	// 	for (var i = 0; i < validArray.length; i++)
	// 	{
	// 		if (!validArray[i]) continue

	// 		var newBoard = _.cloneDeep(board)
	// 		var newBlocks = _.cloneDeep(blocks)
	// 		newBlocks.find((e) => e.type == block.type).Apply(newBoard, y, x, i)
	// 		newBlocks.find((e) => e.type == block.type).Use()
	// 		var newFootprint = _.cloneDeep(footprint)
	// 		newFootprint.push([y, x, block.type, i])

	// 		if (Solve(newBoard, newBlocks, newFootprint, nextPos[0], nextPos[1]))
	// 			return true
	// 	}
	// })

	var available_blocks = blocks.filter((e) => e.count > 0)
	for (var f = 0; f < available_blocks.length; ++f)
	{
		var block = available_blocks[f]
		validArray = block.GetValidArray(board, y, x)

		for (var i = 0; i < validArray.length; i++)
		{
			if (!validArray[i]) continue

			var newBoard = _.cloneDeep(board)
			var newBlocks = _.cloneDeep(blocks)
			newBlocks.find((e) => e.type == block.type).Apply(newBoard, y, x, i)
			newBlocks.find((e) => e.type == block.type).Use()
			var newFootprint = _.cloneDeep(footprint)
			newFootprint.push([y, x, block.type, i])

			if (Solve(newBoard, newBlocks, newFootprint, nextPos[0], nextPos[1]))
				return true
		}
	}

	if (nextPos[0] < board.length)
		return Solve(board, blocks, footprint, nextPos[0], nextPos[1])
	return false
}

function InitBoard(h, w)
{
	var board = []
	for (var i = 0; i < h; ++i)
	{
		var row = []
		for (var j = 0; j < w; ++j) row.push(0)
		board.push(row)
	}
	return board
}

function GetNextPos(h, w, y, x)
{
	return [x + 1 >= w ? y + 1 : y, x + 1 >= w ? 0 : x + 1]
}

function IsFullBoard(board)
{
	for (var i = 0; i < board.length; ++i)
	{
		for (var j = 0; j < board[0].length; ++j)
		{
			if (board[i][j] == 0) return false
		}
	}
	return true
}

function DebugFootprint(footprint)
{
	console.log("[DEBUG] Footprint")
	console.log(footprint)
}

function DebugBoard(board)
{
	console.log("[DEBUG] Board")
	console.log(board)
}
