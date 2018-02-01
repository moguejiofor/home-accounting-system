<?php

class Lang
{
    const DEFAULT_LANG = 'en';

    public static function get($key, $lang)
    {
        $data = self::getData();

        if (isset($data[$key][$lang])) {
            return $data[$key][$lang];
        }
        if ($data[$key][self::DEFAULT_LANG]) {
            return $data[$key][self::DEFAULT_LANG];
        }

        return $key;
    }

    public static function getPrepared($key, $lang, $replaceArray = array())
    {
        $string = self::get($key, $lang);
        foreach ($replaceArray as $replace) {
            $string = TemplateHelper::replaceKey('?', $replace, $string);
        }
        return $string;
    }

    private static function getData()
    {
        return [
            'subject' => [
                'en' => 'Notification from Cromberg',
                'ru' => '����������� �� Cromberg'
            ],
            'main-caption' => [
                'en' => 'Notification',
                'ru' => '���������',
            ],
            'text' => [
                'en' => 'It\'s already last day of the month, it\'s time to fill the current balance data in the Cromberg',
                'ru' => ' ��� ����� ������, ������ ����� ��������� ������� ������ � ������� Cromberg.',
            ],
            'cause' => [
                'en' => 'You have received this email because you use <a href="[[?]]" title="Cromberg - home accounting system">Cromberg</a> app and subscribed for monthly notifications. To unsubscribe, just change settings in the app.
            If you don\'t understand what is it, you can unsubscribe from letters by clicking on <a href="[[?]]">this</a> link.',
                'ru' => '�� �������� ��� ������ ��� ��� ����������� <a href="[[?]]" title="Cromberg - �������� ������� ����� ��������">Cromberg</a> � ����������� �� ����������� �����������. ����� ����������, �������� ��������������� ��������� � ����������.
            ���� �� �� ��������� � ��� ����, ���������� �� ��������� ����� �� ��� <a href="[[?]]">������</a>.',
            ],
        ];
    }
}