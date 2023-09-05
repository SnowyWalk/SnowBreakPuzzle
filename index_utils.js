function remove_childs(element) 
{
    while (element.hasChildNodes())
        element.removeChild(element.firstChild)
}

function clamp(value, min, max)
{
    // value가 최소값(min)보다 작으면 최소값을 반환
    if (value < min)
        return min
    // value가 최대값(max)보다 크면 최대값을 반환
    else if (value > max)
        return max
    // 그 외의 경우에는 value 그대로 반환
    return value
}